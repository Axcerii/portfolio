var requestURL = 'https://raw.githubusercontent.com/bhaaahb/projetTut/main/result-final-f.txt';
var request = new XMLHttpRequest();

request.open('GET', requestURL);
request.responseType = 'json';
request.send();

request.onload = function(){
    var Base_de_donnees = request.response;
        console.table(Base_de_donnees);
    var test = Base_de_donnees["sejour"];
        console.log(test[0]);
    var test2 = test[0];
        console.log(test2["structid"]);
}

