# Adds required environment variables to the linked Vercel project.
# Usage:
#   .\scripts\setup-vercel-env.ps1
#   .\scripts\setup-vercel-env.ps1 -SmtpPass "your-gmail-app-password"
#
# Requires: vercel CLI logged in and project linked (.vercel/project.json)

param(
  [string]$SmtpPass = $env:SMTP_PASS,
  [string]$DatabaseUrl = $env:DATABASE_URL,
  [string]$SmtpUser = "inbox.nuthan@gmail.com",
  [string]$MailTo = "inbox.nuthan@gmail.com",
  [string]$SiteUrl = "https://knowyourcompanytype.vercel.app",
  [string]$CatalogUrl = "https://nuthanm.github.io/KnowYourCompanyType"
)

$ErrorActionPreference = "Continue"
Set-Location (Split-Path $PSScriptRoot -Parent)

function Add-VercelEnv {
  param(
    [Parameter(Mandatory = $true)][string]$Name,
    [AllowNull()][AllowEmptyString()][string]$Value,
    [switch]$Sensitive,
    [switch]$Force
  )

  if ([string]::IsNullOrWhiteSpace($Value)) {
    Write-Host "SKIP $Name (no value provided)"
    return
  }

  $environments = if ($Sensitive) { "production,preview" } else { "production,preview,development" }
  $args = @("env", "add", $Name, $environments, "--value", $Value, "--yes")
  if ($Sensitive) {
    $args += "--sensitive"
  } else {
    $args += "--no-sensitive"
  }
  if ($Force) {
    $args += "--force"
  }

  $output = & vercel @args 2>&1
  $exitCode = $LASTEXITCODE
  if ($exitCode -ne 0) {
    $detail = ($output | Out-String).Trim()
    throw "Failed to add $Name`n$detail"
  }
  Write-Host "OK   $Name"
}

$captchaSecret = node -e "process.stdout.write(require('crypto').randomBytes(32).toString('hex'))"
$adminApiKey = node -e "process.stdout.write(require('crypto').randomBytes(24).toString('hex'))"
$corsOrigins = "https://nuthanm.github.io,https://knowyourcompanytype.com,$SiteUrl"
$mailFrom = "Know Your Company Type <$SmtpUser>"

Write-Host "Adding Vercel environment variables for knowyourcompanytype..."
Write-Host ""

Add-VercelEnv -Name "NEXT_PUBLIC_SITE_URL" -Value $SiteUrl -Force
Add-VercelEnv -Name "NEXT_PUBLIC_CATALOG_URL" -Value $CatalogUrl -Force
Add-VercelEnv -Name "NEXT_PUBLIC_SUBMIT_API_URL" -Value $SiteUrl -Force
Add-VercelEnv -Name "API_CORS_ORIGINS" -Value $corsOrigins -Force
Add-VercelEnv -Name "CAPTCHA_SECRET" -Value $captchaSecret -Sensitive
Add-VercelEnv -Name "ADMIN_API_KEY" -Value $adminApiKey -Sensitive
Add-VercelEnv -Name "SMTP_HOST" -Value "smtp.gmail.com" -Force
Add-VercelEnv -Name "SMTP_PORT" -Value "587" -Force
Add-VercelEnv -Name "SMTP_USER" -Value $SmtpUser -Force
Add-VercelEnv -Name "MAIL_FROM" -Value $mailFrom -Force
Add-VercelEnv -Name "MAIL_TO" -Value $MailTo -Force
Add-VercelEnv -Name "SMTP_PASS" -Value $SmtpPass -Sensitive
Add-VercelEnv -Name "DATABASE_URL" -Value $DatabaseUrl -Sensitive

Write-Host ""
Write-Host "Done. Redeploy production for changes to take effect:"
Write-Host "  vercel --prod"
if (-not $SmtpPass) {
  Write-Host ""
  Write-Host "SMTP_PASS was skipped. Add it with:"
  Write-Host "  .\scripts\setup-vercel-env.ps1 -SmtpPass `"your-gmail-app-password`""
}
Write-Host ""
Write-Host "Pending queue persistence uses DATABASE_URL and/or Upstash Redis JSON."
