(function() {
  let candysFun = {
    all: window.candyData,

    getByType: function() {
      var getBytype = candysFun.all.map(function(candy) {
        var format = {};
        format.image = candy.img;
        format.description = candy.description;
        format.cost = candy.cost;
        format.location = candy.location;
        format.numStar = candy.numStar;
        return format;
      });
      return getBytype;
    },

    getByTypeForReal: function() {
      function sorter(candy) {
        var output = candy.location === inType;
        return output;
      }
      return candysFun.getByType().filter(sorter);
    }

  };

  let tableHelper = {
    clearTable: function() {
      varfindP = document.querySelector('#bodyContainer');
      findP.innerHTML = '';

    },
 
    desMaker: function(ONErec) {
      let div = document.createElement('div' );

      // ---- Name ---- //
      let disName = document.createElement('p');
      let getName = document.createTextNode(ONErec.description);

      disName.setAttribute('class', 'divName');
      disName.appendChild(getName);

      div.appendChild(disName);
      
      // ---- Cost ---- //
      let disCost = document.createElement('p');
      let getCost = document.createTextNode(ONErec.cost);

      disCost.setAttribute('class', 'divCost');
      disCost.appendChild(getCost);

      div.appendChild(disCost);

      // ---- Start ---- //
      let disStar = document.createElement('p');
      let getStar = document.createTextNode(ONErec.numStar + " STARS");

      disStar.setAttribute('class', 'divStars');
      disStar.appendChild(getStar);

      div.appendChild(disStar);




      return div;
    },

    candytoCandyImg: function(img) {
      let image = document.createElement('img');
      image.src = img;
      image.id = 'imgID';
      return image;
    },


   CandyToDiv: function(ONEcandy) {
      var findP = document.querySelector('#bodyContainer'); // finds were to put the new div
      
      var insideDiv = document.createElement('div'); // makes the new div 
      insideDiv.appendChild(tableHelper.candytoCandyImg(ONEcandy.image)); // Gets the image for the other file and add to the new div
      insideDiv.appendChild(tableHelper.desMaker(ONEcandy));
      findP.appendChild(insideDiv); // adding to new div
    }
  };
 
  function setupMenuHandlers() {
/////////
// Sign Up
    let modal = document.querySelector('#modal');
    let btn = document.querySelectorAll("a[href='#signUp']")[0];
    let span = document.querySelector("#rightCX");
    
    btn.onclick = function() {
      modal.style.display = "block";
      };

    span.onclick = function() {
        modal.style.display = 'none';
      };
/////////
// Login
      let modalL = document.querySelector('#modalL');
      let btnL = document.querySelectorAll("a[href='#login']")[0];
      let spanL = document.querySelector("#rightCXL");
      
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = 'none';
        }
        if (event.target == modalL) {
          modalL.style.display = 'none';
        }
      };
  
      btnL.onclick = function() {
        modalL.style.display = "block";
        };
  
      spanL.onclick = function() {
          modalL.style.display = 'none';
        };
    var candyOb = candysFun.getByType();
    for (var i = 0; i < candyOb.length; i++) {
      if(candyOb[i] != null){
        tableHelper.CandyToDiv(candyOb[i]);
      }
    };


    //tableHelper.clearTable();
  }

  window.onload = setupMenuHandlers; 

  //function signUpDropDown(){






//}
  // When the page loads, setup all event handlers by calling setup function.
})();
