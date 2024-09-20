const myImage = document.querySelector('#img');

fetch('imagetest.png').then(function(response){
    return response.blob();
}).then(function(myBlob){
    const objectURL = URL.createObjectURL(myBlob);
    myImage.src = objectURL;
})

/* fetch('JSON/result-final-f.json').then((data)=>{
    return data.json()
}).then((data)=>{
    liste = [...data];
    console.log(liste);
}) */