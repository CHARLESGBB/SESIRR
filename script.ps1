# Solicita as credenciais do usuário
$Credenciais = Get-Credential

# Tenta autenticar no Microsoft Graph
try {
    Connect-MgGraph -Credential $Credenciais -Scopes "Directory.Read.All", "AuditLog.Read.All", "UserAuthenticationMethod.Read.All"
    Write-Output "Autenticação bem-sucedida!"
} catch {
    Write-Error "Erro ao autenticar: $_"
    Exit
}

# Instala o módulo necessário, se não estiver instalado
if (-not (Get-Module -ListAvailable -Name MsIdentityTools)) {
    Write-Output "Instalando o módulo MsIdentityTools..."
    Install-Module -Name MsIdentityTools -Scope CurrentUser -Force
}

# Gera o relatório de autenticação MFA
try {
    Write-Output "Exportando o relatório de autenticação MFA..."
    Export-MsIdAzureMfaReport -Path .\report.xlsx
    Write-Output "Relatório exportado com sucesso: .\report.xlsx"
} catch {
    Write-Error "Erro ao exportar o relatório: $_"
}
