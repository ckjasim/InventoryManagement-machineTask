$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$session.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
$session.Cookies.Add((New-Object System.Net.Cookie("__stripe_mid", "22fa1103-1ab4-4e39-bda8-6a0ab4e91b9ad9e47c", "/", "localhost")))
$session.Cookies.Add((New-Object System.Net.Cookie("session", "eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJalkzT0dZeFlUWTJZemt5WldFek0yVm1ORFl5TlRnMVlTSXNJbVZ0WVdsc0lqb2lhbUZ6YVcxQVoyMWhhV3d1WTI5dElpd2lhV0YwSWpveE56TTNORFE0TnpNNWZRLjFWYy1HZ2pDTmxleGprQmY3WWUzVkpBcVY5NWY5dlRmWE1sdVotcTlLeWMifQ==", "/", "localhost")))
Invoke-WebRequest -UseBasicParsing -Uri "http://localhost:3000/api/sales/placeorder/678f3150cff4f55dbbe253b7/678f30b9cff4f55dbbe25392" `
-Method "POST" `
-WebSession $session `
-Headers @{
"Accept"="application/json, text/plain, */*"
  "Accept-Encoding"="gzip, deflate, br, zstd"
  "Accept-Language"="en-GB,en-US;q=0.9,en;q=0.8,ml;q=0.7"
  "Origin"="http://localhost:5173"
  "Referer"="http://localhost:5173/"
  "Sec-Fetch-Dest"="empty"
  "Sec-Fetch-Mode"="cors"
  "Sec-Fetch-Site"="same-site"
  "sec-ch-ua"="`"Google Chrome`";v=`"131`", `"Chromium`";v=`"131`", `"Not_A Brand`";v=`"24`""
  "sec-ch-ua-mobile"="?0"
  "sec-ch-ua-platform"="`"Windows`""
} `
-ContentType "application/json" `
-Body "{`"customer`":`"678f3150cff4f55dbbe253b7`",`"item`":`"678f30b9cff4f55dbbe25392`",`"stock`":`"3`",`"price`":`"100000`",`"totalPrice`":`"1`"}"