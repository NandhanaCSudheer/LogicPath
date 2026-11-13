$word = New-Object -ComObject Word.Application; $doc = $word.Documents.Open("C:\Users\shyam nived c\Desktop\Software Requirements Specification.docx"); $doc.Content.Text; $doc.Close(); $word.Quit()
