# GitHub CLI を Personal Access Token でログイン（メールコード不要）
param(
    [string]$TokenFile = ""
)

$gh = "${env:ProgramFiles}\GitHub CLI\gh.exe"
if (-not (Test-Path $gh)) {
    Write-Error "gh がありません。winget install GitHub.cli"
}

$token = $env:GITHUB_TOKEN
if (-not $token -and $TokenFile -and (Test-Path $TokenFile)) {
    $token = (Get-Content $TokenFile -Raw).Trim()
}
if (-not $token) {
    Write-Host ""
    Write-Host "=== GitHub トークンでログイン ===" -ForegroundColor Cyan
    Write-Host "1. ブラウザで開く: https://github.com/settings/tokens/new"
    Write-Host "   （Classic token 推奨）"
    Write-Host "2. Note: g-trans-website"
    Write-Host "3. Expiration: 90 days など"
    Write-Host "4. 権限にチェック: repo （リポジトリ作成・push に必要）"
    Write-Host "5. Generate token → 表示された ghp_... をコピー"
    Write-Host ""
    Write-Host "下にトークンを貼り付けて Enter（画面には表示されません）:" -ForegroundColor Yellow
    $secure = Read-Host -AsSecureString
    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    $token = [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
}

if (-not $token) {
    Write-Error "トークンが空です。"
}

$token | & $gh auth login --with-token
if ($LASTEXITCODE -ne 0) {
    Write-Error "gh auth login --with-token に失敗しました。"
}

Write-Host ""
Write-Host "[OK] GitHub ログイン完了" -ForegroundColor Green
& $gh auth status
