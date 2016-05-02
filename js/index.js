
$(function() {
  let noteList = [];
  let playerNoteList = [];
  let intervaTime = 1337;
  let step = 0;
  let level = 0;
  let ready = false;
  let hard = false;
  let seq, timeout;

  $('#easy').on('click', function() {
    ready = true;
    hard = false;
    intervaTime = 500;
    $('#hard,#easy').hide();
    start();
    $('#restart').show();
  });

  $('#hard').on('click', function() {
    ready = true;
    hard = true;
    intervaTime = 350;
    $('#hard,#easy').hide();
    start();
    $('#restart').show();
  });

  $('#restart').on('click', function() {
    clearInterval(seq);
    clearTimeout(timeout);
    $('#hard,#easy').show();
    $(this).hide();
    ready = false;
  });

  function reset() {
    noteList = genNotes();
    $('p').text("Level: 0");
    playerNoteList = [];
    step = 0;
    level = 0;
  }

  function start() {
    reset();
    playNoteSeq();
  }

  $('#c,#d,#e,#f').on('click', function() {

    // notes to be played if game hasnt started
    if (ready) {
      let clickedNote = this.id;
      playerNoteList.push(clickedNote);

      if (playerNoteList.length == (step + 1)) {
        if (checkAllNotes()) {
          nextLevel();
        } else {
          failedLevel();
        }
      } else if (!checkSomeNotes()) {
        failedLevel();
      }
    }
  });

  function nextLevel() {
    step++;
    $('p').text('Level: ' + step);
    playNoteSeq();
    playerNoteList = [];
  }

  function failedLevel() {
    playerNoteList = [];
    playNoteSeq();
    failedLevelMSG();

    // if hard mode is on game will restart if any error is made
    if (hard) {
      // restart game
      reset();
    }
  }
  // function errorDisplay(){
  //   $('body').css("background-color", "yellow");
  //   setTimeout(function(){
  //     $('body').css("background-color", "white");
  //   },350);
  // }
  
  function failedLevelMSG() {
    $('p').text('Try Level: ' + step + ' Again');
  }

  // checks all notes up to current step
  function checkAllNotes() {
    for (let i = 0; i <= step; i++) {
      if (noteList[i] != playerNoteList[i]) {
        return false;
      }
    }
    return true;
  }

  // checks each note as they are clicked
  function checkSomeNotes() {
    for (let i = 0; i < playerNoteList.length; i++) {
      if (noteList[i] != playerNoteList[i]) {
        return false;
      }
    }
    return true;
  }

  // Play Notes up to current level
  function playNoteSeq() {
    // make notes unclickable
    $('#c,#d,#e,#f').css("pointer-events", "none");

    // wait 1000ms after last player move
    timeout = setTimeout(function() {
      level = 0;

      // wait x ms before playing next note in the noteList array
      seq = setInterval(playInterval, intervaTime);
    }, 1000);

  }

  function win() {
    alert('Victory');
    start();
  }

  function playInterval() {

    playNote(noteList[level]);

    // play all notes up to current step
    if (step <= level) {

      // make notes clickable
      $('#c,#d,#e,#f').css("pointer-events", "auto");

      // stop setInterval 
      clearInterval(seq);
    }
    level++;
    if (level === 20) {
      // you win
      win();
      alert('Victory');
    }

  }

  // creates a random list of numbers that do not repeat, no 1,1...
  // min: min number in range
  // max: max number in range
  // length: length of the number array to create
  function random(min, max, length) {
    let numbers = [];

    function _random(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    Array.apply(null, new Array(length)).reduce(function(previous) {
      let nextRandom;

      if (previous === min) {
        nextRandom = _random(min + 1, max);
      } else if (previous === max) {
        nextRandom = _random(min, max - 1);
      } else {
        if (_random(0, 1)) {
          nextRandom = _random(previous + 1, max);
        } else {
          nextRandom = _random(min, previous - 1);
        }
      }

      numbers.push(nextRandom);
      return nextRandom;
    }, _random(min, max));

    return numbers;
  }

  // pair notes to their random numbers
  function genNotes() {
    let randomNotes = [];
    let notes = ['c', 'd', 'e', 'f'];
    let randomNum = random(0, 3, 20);

    for (var i = 0; i < randomNum.length; i++) {
      randomNotes.push(notes[randomNum[i]]);
    }
    return randomNotes;
  }

  $('#c').click(function() {
    playNote('c');
  });

  $('#d').click(function() {
    playNote('d');
  });

  $('#e').click(function() {
    playNote('e');
  });

  $('#f').click(function() {
    playNote('f');
  });

  // note is a char pulled from the id of each button
  function playNote(note) {

    // light up note
    $('#' + note).focus();

    // keep note lite for the full intervralTime
    setTimeout(function() {
      $('#' + note).blur();
    }, intervaTime);

    playAudioNote(note + 'Audio');

    function playAudioNote(note) {

      let n = document.getElementById(note);

      //console.log(document.getElementById('c'));
      // "<audio id='cAudio'> <source src = 'http://torchcodelab.com/media/c_note.mp3'type = 'audio/mpeg' ></audio>"

      // This is a property that scrubs the audio file back to its start.
      n.currentTime = 0;
      n.play();
    }
  }
});