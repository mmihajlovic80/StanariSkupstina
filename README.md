# StanariSkupstina
Portal Skupštine stanara



Da bi se na najbolji mogući način upravljalo stambenim zgradama, Vlada Republike Srbije je predložila, 
a Skupština Republike Srbije krajem 2016te godine usvojila “Zakon o održavanju stambenih zgrada”, 
kojim svaka stambena zgrada stiče svojstvo pravnog lica. Stambenim zgradama upravlja Skupština stanara, 
koju čine svi vlasnici stanova i posebnih delova zgrade (garaža, lokala). 
Savremeni način života, a naročito život u velikim gradovima, ostavlja čoveku jako malo vremena za bavljenje najbližima 
i samim sobom, a na listi prioriteta za trošenje slobodnog vremena sastanci Skupštine stanara se nalaze ubedljivo na samom začelju.
Zbog toga smo i napravili portal “Skupština stanara” koji bi mogao da doprinese efikasnijem radu Skupština i na taj način poboljša 
život stanarima zgrada koje ga koriste.

Upotreba portala je krajnje pojednostavljena, kako bi se i našim korisnicima koji nisu vični radu sa računarom, omogućilo da ga koriste. 
Pre korišćenja potrebno je uraditi registraciju korisnika. Potom se radi logovanje i ako se kroz autentifikaciju povrdi postojanje
korisnika u bazi podataka, pristupa se forumu, na kojem se ostavljaju poruke stanara i odvija rasprava o aktuelnim problemima i
poboljšanju života stanara u zgradi.



projekat je pisan u Node.js
korišćena je jquery biblioteka
bootstrap – css freamwork
express modul – rutiranje
mongoDB omotač, koji omogućava API za MongoDB objekte
mongoose biblioteka koja posreduje između Node.js i MongoDB
EJS - view engine
body parser – modul za parsiranje HTTP requesta
passport - dodatak koji vrši autentifikaciju pri loginu
passport-local
bcrypt služi za hašovanje podataka (šifre)
express-validator je set express middleware za validaciju
express-session pravi sesiju

