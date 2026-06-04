# リポジトリを組織 g-trans へ移行し Pages URL を更新する
param(
    [string]$Org = "g-trans",
    [string[]]$Repos = @("g-trans-website", "g-trans-immersive")
)

$ErrorActionPreference = "Stop"
$gh = "${env:ProgramFiles}\GitHub CLI\gh.exe"
if (-not (Test-Path $gh)) { Write-Error "gh が必要です: winget install GitHub.cli" }

Write-Host "組織 '$Org' の確認..." -ForegroundColor Cyan
& $gh api "orgs/$Org" -q .login 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "組織 '$Org' がまだありません。先にブラウザで作成してください:" -ForegroundColor Yellow
    Write-Host "  https://github.com/organizations/plan?organization_name=$Org"
    Write-Host "  → Free → Create organization → 名前: $Org"
    Write-Host ""
    Write-Host "作成後、このスクリプトを再実行してください。" -ForegroundColor Yellow
    exit 1
}

foreach ($repo in $Repos) {
    $full = "Tatsumaru2016/$repo"
    Write-Host "移行: $full -> $Org/$repo" -ForegroundColor Cyan
    & $gh api -X POST "repos/$full/transfer" -f "new_owner=$Org" 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  transfer API 失敗。手動: Settings -> Transfer ownership -> $Org" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=== 移行後の公開 URL ===" -ForegroundColor Green
foreach ($repo in $Repos) {
    Write-Host "  https://$Org.github.io/$repo/"
}
Write-Host ""
Write-Host "各リポジトリ Settings -> Pages -> Source: GitHub Actions を確認してください。"
