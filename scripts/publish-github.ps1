# GitHub に push し、Pages（Actions）を有効化する
param(
    [string]$RepoName = "g-trans-website",
    [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
)

$ErrorActionPreference = "Stop"
$gh = "${env:ProgramFiles}\GitHub CLI\gh.exe"
if (-not (Test-Path $gh)) {
    Write-Error "GitHub CLI (gh) がありません。winget install GitHub.cli を実行してください。"
}

Push-Location $ProjectRoot

$loggedIn = $true
try {
    $null = & $gh auth status 2>&1
    if ($LASTEXITCODE -ne 0) { $loggedIn = $false }
} catch {
    $loggedIn = $false
}
if (-not $loggedIn) {
    Write-Host ""
    Write-Host "GitHub にログインしてください（ブラウザが開きます）:" -ForegroundColor Yellow
    & $gh auth login -h github.com -p https -w
    if ($LASTEXITCODE -ne 0) {
        Write-Error "GitHub ログインに失敗しました。もう一度 npm run publish:github を実行してください。"
    }
}

$owner = (& $gh api user -q .login).Trim()
Write-Host "Account: $owner" -ForegroundColor Cyan

$hasOrigin = $false
$prevEap = $ErrorActionPreference
$ErrorActionPreference = "SilentlyContinue"
$null = git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0) { $hasOrigin = $true }
$ErrorActionPreference = $prevEap

if (-not $hasOrigin) {
    Write-Host "リポジトリを作成して push します: $RepoName" -ForegroundColor Cyan
    & $gh repo create $RepoName --public --source=. --remote=origin --push
    if ($LASTEXITCODE -ne 0) {
        Write-Host "リポジトリ作成をスキップし、既存リポジトリへ接続を試みます..." -ForegroundColor Yellow
        git remote add origin "https://github.com/$owner/$RepoName.git"
        git push -u origin main
    }
} else {
    $remote = git remote get-url origin
    Write-Host "既存 remote へ push: $remote" -ForegroundColor Cyan
    git push -u origin main
}

# GitHub Pages（Actions ビルド）
Write-Host "GitHub Pages を有効化..." -ForegroundColor Cyan
try {
    & $gh api -X POST "repos/$owner/$RepoName/pages" -f build_type=workflow 2>$null
} catch {
    try {
        & $gh api -X PUT "repos/$owner/$RepoName/pages" -f build_type=workflow
    } catch {
        Write-Host "[!] Pages API をスキップ。Settings → Pages → Source: GitHub Actions を手動で選んでください。" -ForegroundColor Yellow
    }
}

$pagesUrl = "https://$owner.github.io/$RepoName/"
Write-Host ""
Write-Host "=== 公開手順完了 ===" -ForegroundColor Green
Write-Host "  リポジトリ: https://github.com/$owner/$RepoName"
Write-Host "  Pages URL:  $pagesUrl"
Write-Host "  （Actions のデプロイ完了まで 1〜3 分かかることがあります）"
Write-Host "  状態確認:   https://github.com/$owner/$RepoName/actions"
Write-Host ""

Pop-Location
