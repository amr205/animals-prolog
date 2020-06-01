var defaultProgram = `
carac_animal(A,X):-animal(A),class(A,Y),carac_class(Y,X).
animal(dog).
animal(frog).
animal(wolf).
animal(rabbit).
animal(puma).
animal(jaguar).
animal(hummingbird).
carac_animal(frog,wild).
carac_animal(wolf,wild).
carac_animal(dog,domestic).
carac_animal(rabbit,domestic).
carac_animal(puma,wild).
carac_animal(jaguar,wild).
carac_animal(hummingbird,wild).
class(frog,amphibian).
class(wolf,canine).
class(dog,canine).
class(rabbit,rodent).
class(puma,feline).
class(jaguar,feline).
class(hummingbird,bird).
carac_class(amphibian,suffers_metamorphosis).
carac_class(amphibian,slimy_skin).
carac_class(amphibian,oviparous).
carac_class(amphibian,quadruped).
carac_class(canine,long_snout).
carac_class(canine,non_retractile_nails).
carac_class(canine,mammal).
carac_class(canine,quadruped).
carac_class(rodent,incisive_teeth).
carac_class(rodent,gnawing_ability).
carac_class(rodent,mammal).
carac_class(rodent,quadruped).
carac_class(feline,whiskers).
carac_class(feline,small_snout).
carac_class(feline,retractile_nails).
carac_class(feline,quadruped).
carac_class(feline,mammal).
carac_class(bird,wings).
carac_class(bird,beak).
carac_class(bird,feathers).
carac_class(bird,oviparous).
carac_class(bird,biped).
`;

var session;
var parsed;
var answer_list = [];
var answer_boolean = false;

document.addEventListener('DOMContentLoaded', function(){ 
    loadKnowledgeBase()
    populateAnimals()
    populateClasses()
    populateCaracs()
}, false);

function createAnimal(){
    let animalName = document.getElementById("animal_name_txt").value
    let animalClass = document.getElementById("select_class_anim").value
    let animalCaracs = document.getElementById("animal_caracs_txt").value 

    if(animalName!=""){
        //assertName
        let newAnimal = insertPredicate("animal("+animalName+")")

        if(newAnimal){
            insertPredicate("class("+animalName+","+animalClass+")")
            animalCaracs = animalCaracs.replace(/\s/g,'')
            let listCaracs = animalCaracs.split(',')

            listCaracs.forEach(carac => {
                insertPredicate("carac_animal("+animalClass+","+carac+")")
            });
            alert("animal añadido")
        }else{
            alert("El animal ya existe")
        }
        
        populateAnimals()
        populateClasses()
        populateCaracs()
        
    }
}

function createClass(){
    let className = document.getElementById("class_name_txt").value
    let classCaracs = document.getElementById("class_caracs_txt").value 

    if(className!="" && classCaracs!=""){
        //assertName
        parsed = session.query("carac_class("+className+",_).")
        session.answer( saveAnswerBoolean )
        let newClass = !answer_boolean

        if(newClass){
            classCaracs = classCaracs.replace(/\s/g,'')
            let listCaracs = classCaracs.split(',')

            listCaracs.forEach(carac => {
                insertPredicate("carac_class("+className+","+carac+")")
            });
            alert("clase añadida")
        }else{
            alert("La clase ya existe")
        }
        
        populateAnimals()
        populateClasses()
        populateCaracs()
        
    }
}

function searchAnimalCarac(){
    if( parsed) {
        answer_list = []
        parsed = session.query("carac_animal("+document.getElementById("select_animal").value+",X)."); 
        session.answer( saveAnswerInList );     
        

        const myNode = document.getElementById("result_basic");
        myNode.innerHTML = '';
        
        var request = new XMLHttpRequest();
        request.open('GET', 'https://pixabay.com/api/?key=16788669-3909ecff2962053fe8842dd53&q='+document.getElementById("select_animal").value+'&image_type=photo&category=animals&per_page=3', false);  // `false` makes the request synchronous
        request.send(null);

        if (request.status === 200) {
            let response = JSON.parse(request.response);
            let image_url = response.hits[0].webformatURL
            myNode.innerHTML += '<img width="350px" src="'+image_url+'" alt="pic" />';
        }


        
        answer_list.forEach(carac => {
            myNode.innerHTML += '<p>'+carac.toString()+'</p>';
        });
        parsed = session.query("carac_animal("+document.getElementById("select_animal").value+",X)."); 
        session.draw( 10, "derivation" );
    }
}

function searchAnimals(){
    if( parsed) {
        answer_list = []
        let caractheristics = $('#select_carac').val()
        let goal = "animal(X)"
        caractheristics.forEach(element => {
            goal+=",carac_animal(X,"+element.toString()+")"
        });
        goal+="."
        
        parsed = session.query(goal); 
        session.answer( saveAnswerInList );     
        

        const myNode = document.getElementById("result_animals");
        myNode.innerHTML = '';
        
        answer_list.forEach(animal => {
            myNode.innerHTML += '<div>'

            var request = new XMLHttpRequest();
            request.open('GET', 'https://pixabay.com/api/?key=16788669-3909ecff2962053fe8842dd53&q='+animal+'&image_type=photo&category=animals&per_page=3', false);  // `false` makes the request synchronous
            request.send(null);
    
            if (request.status === 200) {
                let response = JSON.parse(request.response);
                let image_url = response.hits[0].webformatURL
                myNode.innerHTML += '<img width="350px" src="'+image_url+'" alt="pic" />';
            }

            myNode.innerHTML += '<p>'+animal.toString()+'</p>';
            myNode.innerHTML += '</div>'
        });
        parsed = session.query(goal); 
        session.draw( 10, "derivation" );
    }
}



function searchClassCarac(){
    if( parsed) {
        answer_list = []
        parsed = session.query("carac_class("+document.getElementById("select_class").value+",X)."); 
        session.answer( saveAnswerInList );     

        const myNode = document.getElementById("result_basic");
        myNode.innerHTML = '';
        
        var request = new XMLHttpRequest();
        request.open('GET', 'https://pixabay.com/api/?key=16788669-3909ecff2962053fe8842dd53&q='+document.getElementById("select_class").value+'&image_type=photo&category=animals&per_page=3', false);  // `false` makes the request synchronous
        request.send(null);

        if (request.status === 200) {
            let response = JSON.parse(request.response);
            let image_url = response.hits[0].webformatURL
            myNode.innerHTML += '<img width="350px" src="'+image_url+'" alt="pic" />';
        }


        
        answer_list.forEach(carac => {
            myNode.innerHTML += '<p>'+carac.toString()+'</p>';
        });
        parsed = session.query("carac_class("+document.getElementById("select_class").value+",X)."); 
        session.draw( 10, "derivation" );
    }
}

var printUntilFalse = function( answer ) { 
    if(answer!=false){
        console.log( answer.links.X.id  ); 
        session.answer( printUntilFalse );

    }
};

var saveAnswerInList = function( answer ) { 
    if(answer!=false){
        let element = answer.links.X.id;
        if(answer_list.indexOf(element)==-1)
            answer_list.push(element);
        session.answer( saveAnswerInList );
    }
};

var saveAnswerBoolean = function( answer ) { 
    if(answer!=false){
        answer_boolean = true;
    }else{
        answer_boolean = false;
    }
};

function populateAnimals(){
    if( parsed) {
        answer_list = []
        parsed = session.query("animal(X)."); 
        session.answer( saveAnswerInList );     

        const myNode = document.getElementById("select_animal");
        myNode.innerHTML = '';

        answer_list.forEach(animal => {
            myNode.innerHTML += '<option value="'+animal.toString()+'">'+animal.toString()+'</option>';
        });
    }
}

function populateCaracs(){
    if( parsed) {
        answer_list = []
        parsed = session.query("carac_animal(_,X)."); 
        session.answer( saveAnswerInList );     

        const myNode = document.getElementById("select_carac");
        myNode.innerHTML = '';

        answer_list.forEach(carac => {
            myNode.innerHTML += '<option value="'+carac.toString()+'">'+carac.toString()+'</option>';
        });
    }
}

function populateClasses(){
    if( parsed) {
        answer_list = []
        parsed = session.query("carac_class(X,_)."); 
        session.answer( saveAnswerInList );     

        const myNode = document.getElementById("select_class");
        myNode.innerHTML = '';

        answer_list.forEach(my_class => {
            myNode.innerHTML += '<option value="'+my_class.toString()+'">'+my_class.toString()+'</option>';
        });

        const myNode2 = document.getElementById("select_class_anim");
        myNode2.innerHTML = '';

        answer_list.forEach(my_class => {
            myNode2.innerHTML += '<option value="'+my_class.toString()+'">'+my_class.toString()+'</option>';
        });
    }
}

function loadKnowledgeBase(){
    session  = pl.create();

    if (typeof(Storage) !== "undefined") {
        //si hay local storage
        if (localStorage.getItem("knowledgeBase") === null) {
            parsed = session.consult(defaultProgram); 
            saveKnowledgeBase();
        }else{
            let knowledgeBase = localStorage.getItem("knowledgeBase");
            parsed = session.consult(knowledgeBase); 
        }
    } else {
        //no hay local storage
        parsed = session.consult(defaultProgram); 
        alert("Para ingresar nuevos animales se requiere de la función local storage, use Chrome o Firefox")
    }

}

function saveKnowledgeBase(){
    console.log("Saved")
    localStorage.setItem("knowledgeBase",session.toString())
}

function deleteKnowledgeBase(){
    localStorage.removeItem("knowledgeBase")
}

function insertPredicate(pred){
    if( parsed) {
        parsed = session.query(pred+".")
        session.answer( saveAnswerBoolean )
        if(!answer_boolean){
            console.log(pred)
            localStorage.setItem("knowledgeBase",session.toString()+"\n"+pred+".")
            loadKnowledgeBase()
            return true;
        }else{
            console.log("el predicado ya existe.")
            return false;
        }
    }
}