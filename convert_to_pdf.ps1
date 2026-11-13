$docxPath = "C:\Users\shyam nived c\Desktop\LogicPath\LogicPath_Project_Report.docx"
$pdfPath = "C:\Users\shyam nived c\Desktop\LogicPath\LogicPath_Project_Report.pdf"

Write-Host "Opening Microsoft Word to export PDF..."
$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
    $doc = $word.Documents.Open($docxPath)
    # Update all fields / TOC if needed
    # $doc.Fields.Update()
    # Format 17 is wdFormatPDF
    $doc.SaveAs([ref]$pdfPath, [ref]17)
    $doc.Close([ref]0)
    Write-Host "Successfully generated PDF at: $pdfPath"
} catch {
    Write-Error "Error during PDF conversion: $_"
} finally {
    $word.Quit()
}
