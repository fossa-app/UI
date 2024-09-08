<#
.Synopsis
    Build script

.Description
    TASKS AND REQUIREMENTS
    Initialize and Clean repository
    Restore packages
    Format code
    Build
    Run Tests
    Pack
    Publish
#>

[System.Diagnostics.CodeAnalysis.SuppressMessageAttribute('PSReviewUnusedParameter', '', Justification = 'Parameter is used actually.')]
param(
    # Build Version
    [Parameter()]
    [string]
    $Version,
    # Build Instance
    [Parameter()]
    [string]
    $Instance
)

Set-StrictMode -Version Latest

# Synopsis: Publish Docker images
Task Publish Pack, {
    $state = Import-Clixml -Path ".\.trash\$Instance\state.clixml"
    $dockerImageVersionTag = $state.DockerImageVersionTag
    $dockerImageLatestTag = $state.DockerImageLatestTag
    $dockerImageVersionArchiveName = $state.DockerImageVersionArchiveName
    $dockerImageLatestArchiveName = $state.DockerImageLatestArchiveName
    $dockerImageVersionArchive = Resolve-Path -Path ".\.trash\$Instance\artifacts\$dockerImageVersionArchiveName"
    $dockerImageLatestArchive = Resolve-Path -Path ".\.trash\$Instance\artifacts\$dockerImageLatestArchiveName"

    Exec { docker image load --input $dockerImageVersionArchive }
    Exec { docker image load --input $dockerImageLatestArchive }

    if ($null -eq $env:DOCKER_ACCESS_TOKEN) {
        Import-Module -Name Microsoft.PowerShell.SecretManagement
        $credential = Get-Secret -Name 'Fossa-DockerHub-Credential'
    }
    else {
        $securePassword = New-Object SecureString
        foreach ($char in $env:DOCKER_ACCESS_TOKEN.ToCharArray()) {
            $securePassword.AppendChar($char)
        }
        $credential = [PSCredential]::New('tiksn', $securePassword)
    }

    $username = $credential.UserName
    $password = $credential.GetNetworkCredential().Password

    Exec { docker login --username $username --password $password }
    Exec { docker push $dockerImageVersionTag }
    Exec { docker push $dockerImageLatestTag }
}

# Synopsis: Pack NuGet package
Task Pack Build, Test, EstimateVersion, {
    $state = Import-Clixml -Path ".\.trash\$Instance\state.clixml"
    $dockerImageName = $state.DockerImageName
    $nextVersion = $state.NextVersion
    $dockerFilePath = Resolve-Path -Path '.\Dockerfile'

    $dockerImageVersionTag = "$($dockerImageName):$nextVersion"
    $dockerImageLatestTag = "$($dockerImageName):latest"

    $dockerImageVersionArchiveName = $state.DockerImageVersionArchiveName
    $dockerImageLatestArchiveName = $state.DockerImageLatestArchiveName
    $dockerImageVersionArchive = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath(".\.trash\$Instance\artifacts\$dockerImageVersionArchiveName")
    $dockerImageLatestArchive = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath(".\.trash\$Instance\artifacts\$dockerImageLatestArchiveName")

    Exec { docker buildx build --file $dockerFilePath --tag $dockerImageVersionTag --tag $dockerImageLatestTag . }
    Exec { docker image save --output $dockerImageVersionArchive $dockerImageVersionTag }
    Exec { docker image save --output $dockerImageLatestArchive $dockerImageLatestTag }

    $state.DockerImageVersionTag = $dockerImageVersionTag
    $state.DockerImageLatestTag = $dockerImageLatestTag

    $state | Export-Clixml -Path ".\.trash\$Instance\state.clixml"
    Write-Output $state
}

# Synopsis: Test
Task Test UnitTest, FunctionalTest, IntegrationTest

# Synopsis: Integration Test
Task IntegrationTest Build, {
    if (-not $env:CI) {
    }
}

# Synopsis: Functional Test
Task FunctionalTest Build, {
}

# Synopsis: Unit Test
Task UnitTest Build, {
    Exec { npm test }
}

# Synopsis: Build
Task Build Format, {
    Exec { npm run build }
}

# Synopsis: Estimate Next Version
Task EstimateVersion Restore, {
    $state = Import-Clixml -Path ".\.trash\$Instance\state.clixml"
    if ($Version) {
        $state.NextVersion = [System.Management.Automation.SemanticVersion]$Version
    }
    else {
        $gitversion = Exec { git describe --tags --dirty --always }
        $state.NextVersion = [System.Management.Automation.SemanticVersion]::Parse($gitversion)
    }

    $state | Export-Clixml -Path ".\.trash\$Instance\state.clixml"
    Write-Output "Next version estimated to be $($state.NextVersion)"
    Write-Output $state
}

# Synopsis: Format
Task Format Restore, Lint, {
    Exec { npm run format }
}

# Synopsis: Lint
Task Lint Restore, {
    if ($IsLinux) {
        Exec { chmod +x .husky/pre-commit }
    }
    Exec { npm run lint }
}

# Synopsis: Format XML Files
Task FormatXmlFiles Clean, {
    Get-ChildItem -Include *.xml, *.config, *.props, *.targets, *.nuspec, *.resx, *.ruleset, *.vsixmanifest, *.vsct, *.xlf, *.csproj -Recurse -File
    | Where-Object { -not (git check-ignore $PSItem) }
    | ForEach-Object {
        Write-Output "Formatting XML File: $PSItem"
        $content = Get-Content -Path $PSItem -Raw
        $xml = [xml]$content
        $xml.Save($PSItem)
    }
}

# Synopsis: Restore
Task Restore RestorePackages

# Synopsis: Restore packages
Task RestorePackages Clean, {
    Exec { npm ci }
}

# Synopsis: Clean previous build leftovers
Task Clean Init, {
}

# Synopsis: Initialize folders and variables
Task Init {
    $trashFolder = Join-Path -Path . -ChildPath '.trash'
    $trashFolder = Join-Path -Path $trashFolder -ChildPath $Instance
    New-Item -Path $trashFolder -ItemType Directory | Out-Null
    $trashFolder = Resolve-Path -Path $trashFolder

    $buildArtifactsFolder = Join-Path -Path $trashFolder -ChildPath 'artifacts'
    New-Item -Path $buildArtifactsFolder -ItemType Directory | Out-Null

    $state = [PSCustomObject]@{
        NextVersion                   = $null
        TrashFolder                   = $trashFolder
        BuildArtifactsFolder          = $buildArtifactsFolder
        DockerImageName               = 'tiksn/fossa-ui'
        DockerImageVersionTag         = $null
        DockerImageLatestTag          = $null
        DockerImageVersionArchiveName = 'tiksn-fossa-ui-version.tar'
        DockerImageLatestArchiveName  = 'tiksn-fossa-ui-latest.tar'
    }

    $state | Export-Clixml -Path ".\.trash\$Instance\state.clixml"
    Write-Output $state
}
