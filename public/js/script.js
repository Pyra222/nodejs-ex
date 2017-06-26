$().ready(function(){
    $(".menu_item").on("click", function(event){
        var text = $(event.target).text();
        setContent(text.substring(0,text.indexOf("(")));        
    });
    
    setContent("home");
});

function send(){
    console.log("DUPA");
    var address = document.getElementById("address").value;
    var topic = document.getElementById("topic").value;
    var message = document.getElementById("message").value;
    $.post("/sendMessage",{address: address, topic: topic, message: message}, function(data){
        alert("Thank you for your feedback."); 
    });
}

function setContent(selector){
    $.get("/content/"+selector, function(data){
        $("#content").html(data);
        if(selector=="projects.show"){
            console.log(selector);
            getProjects();
        }
        rotateTitle();
    });
}

function getProjects(){
    $.get("/projects", function(data){
        $("#projects").html(data); 
    });
}

function rotateTitle(){
    var title = document.getElementById("content").getElementsByTagName('h1')[0];
    var spare = "";
    spare = title.innerHTML;
    for(var i=0;i<20;i++){
        setTimeout(function(){
            var titleArray = new Array(spare.length);
            for(var i=0;i<titleArray.length;i++){
                titleArray[i] = String.fromCharCode(getRandomArbitrary(65,91));
            }
            title.innerHTML = titleArray.join("");
        },i*50);
    }
    setTimeout(function(){
        title.innerHTML = spare;
    },1000);
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
