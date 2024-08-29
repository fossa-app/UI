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
        $gitversion = Exec { dotnet tool run dotnet-gitversion } | ConvertFrom-Json
        $state.NextVersion = [System.Management.Automation.SemanticVersion]::Parse($gitversion.SemVer)
    }

    $state | Export-Clixml -Path ".\.trash\$Instance\state.clixml"
    Write-Output "Next version estimated to be $($state.NextVersion)"
    Write-Output $state
}

# Synopsis: Format
Task Format Restore, FormatWhitespace

# Synopsis: Format Whitespace
Task FormatWhitespace Restore, {
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

    $linuxBuildArtifactsFolder = Join-Path -Path $buildArtifactsFolder -ChildPath 'linux'
    New-Item -Path $linuxBuildArtifactsFolder -ItemType Directory | Out-Null

    $winBuildArtifactsFolder = Join-Path -Path $buildArtifactsFolder -ChildPath 'win'
    New-Item -Path $winBuildArtifactsFolder -ItemType Directory | Out-Null

    $state = [PSCustomObject]@{
        NextVersion                   = $null
        TrashFolder                   = $trashFolder
        BuildArtifactsFolder          = $buildArtifactsFolder
        LinuxBuildArtifactsFolder     = $linuxBuildArtifactsFolder
        WinBuildArtifactsFolder       = $winBuildArtifactsFolder
        DockerImageName               = 'tiksn/fossa-ui'
        DockerImageVersionTag         = $null
        DockerImageLatestTag          = $null
        DockerImageVersionArchiveName = 'tiksn-fossa-ui-version.tar'
        DockerImageLatestArchiveName  = 'tiksn-fossa-ui-latest.tar'
    }

    $state | Export-Clixml -Path ".\.trash\$Instance\state.clixml"
    Write-Output $state
}
