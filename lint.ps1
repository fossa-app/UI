docker run --rm `
    -e CREATE_LOG_FILE=true `
    -e DEFAULT_BRANCH=main `
    -e ENABLE_GITHUB_ACTIONS_GROUP_TITLE=true `
    -e FIX_MODE_ENABLED=true `
    -e FIX_CSHARP=true `
    -e FIX_CSS_PRETTIER=true `
    -e FIX_CSS=true `
    -e FIX_DOTNET_SLN_FORMAT_ANALYZERS=true `
    -e FIX_DOTNET_SLN_FORMAT_STYLE=true `
    -e FIX_DOTNET_SLN_FORMAT_WHITESPACE=true `
    -e FIX_ENV=true `
    -e FIX_JAVASCRIPT_ES=true `
    -e FIX_JAVASCRIPT_PRETTIER=true `
    -e FIX_JSON=true `
    -e FIX_JSON_PRETTIER=true `
    -e FIX_MARKDOWN=true `
    -e FIX_MARKDOWN_PRETTIER=true `
    -e FIX_NATURAL_LANGUAGE=true `
    -e FIX_SHELL_SHFMT=true `
    -e FIX_TSX=true `
    -e FIX_TYPESCRIPT_ES=true `
    -e FIX_TYPESCRIPT_PRETTIER=true `
    -e FIX_TYPESCRIPT_STANDARD=true `
    -e FIX_YAML_PRETTIER=true `
    -e LOG_LEVEL=DEBUG `
    -e RUN_LOCAL=true `
    -e VALIDATE_JSCPD=false `
    -e VALIDATE_ALL_CODEBASE=true `
    -v .:/tmp/lint `
    ghcr.io/super-linter/super-linter:latest
