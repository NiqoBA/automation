$Action = New-ScheduledTaskAction -Execute "c:\Users\nicov\Documents\Niqo\Scraper\unified-scraper\run_daily.bat"
$Trigger = New-ScheduledTaskTrigger -Daily -At 6am
$Settings = New-ScheduledTaskSettingsSet
$TaskName = "UnifiedScraperDaily"

Register-ScheduledTask -Action $Action -Trigger $Trigger -Settings $Settings -TaskName $TaskName -Description "Ejecuta scraper inmobiliario diariamente a las 6 AM"

Write-Host "Tarea programada '$TaskName' creada exitosamente para las 6:00 AM."
