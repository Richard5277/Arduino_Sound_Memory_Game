/*
 * This file send a "1" or "0" each time a button is pressed or released.
*/
//#include <stdio.h>
//#include <string.h>

// Create a variable to store the current state of the button
int button2State = 0;
int button3State = 0;
int button4State = 0;
int button5State = 0;

// enter button
int button6State = 0;

// start button
int button7State = 0;

// Create a variable to store the previous state of the button
int prevButton2State = 0;
int prevButton3State = 0;
int prevButton4State = 0;
int prevButton5State = 0;
int prevButton6State = 0;
int prevButton7State = 0;

// Set 1
int pushButton2 = 2;
int led8 = 8;

// Set 2
int pushButton3 = 3;
int led9 = 9;

// Set 3
int pushButton4 = 4;
int led10 = 10;

// Set 4
int pushButton5 = 5;
int led11 = 11;

// enter button
int pushButton6 = 6;

// start button
int pushButton7 = 7;

void setup() {
  
  // Set 1
  pinMode(pushButton2, INPUT);
  pinMode(led8, OUTPUT);
  digitalWrite(led8, LOW);
  
  // Set 2
  pinMode(pushButton3, INPUT);
  pinMode(led9, OUTPUT);
  digitalWrite(led9, LOW);

  // Set 3
  pinMode(pushButton4, INPUT);
  pinMode(led10, OUTPUT);
  digitalWrite(led10, LOW);

  // Set 4
  pinMode(pushButton5, INPUT);
  pinMode(led11, OUTPUT);
  digitalWrite(led11, LOW);

  // enter button
  pinMode(pushButton6, INPUT);

  // start button
  pinMode(pushButton7, INPUT);
  
  Serial.begin(9600);
  
}

void lightLED (int number) {
  switch (number){
        case 1:
          digitalWrite(led8, HIGH);
          delay(400);
          digitalWrite(led8, LOW);
          break;
       case 2:
          digitalWrite(led9, HIGH);
          delay(400);
          digitalWrite(led9, LOW);
          break;
      case 3:
          digitalWrite(led10, HIGH);
          delay(400);
          digitalWrite(led10, LOW);
          break;
       case 4:
          digitalWrite(led11, HIGH);
          delay(400);
          digitalWrite(led11, LOW);
          break; 
      }
      return;
}

void loop() {
  
  // Read button status
  button2State = digitalRead(pushButton2);
  button3State = digitalRead(pushButton3);
  button4State = digitalRead(pushButton4);
  button5State = digitalRead(pushButton5);
  button6State = digitalRead(pushButton6);
  button7State = digitalRead(pushButton7);
  
  // Set 1
  if (prevButton2State != button2State) {
    
    if (button2State == HIGH){
      int data = 0;
      Serial.println(data);
      digitalWrite(led8, HIGH);
    }
    else
    {
      digitalWrite(led8, LOW);
    }
    prevButton2State = button2State;
      // Add slight delay
  delay(50);
    
  }
  //////////////////////////////////////////////////////

   // Set 2
  if (prevButton3State != button3State) {
    
    if (button3State == HIGH){
      int data = 1;
      Serial.println(data);
      digitalWrite(led9, HIGH);
    }
    else
    {
      digitalWrite(led9, LOW);
    }
    prevButton3State = button3State;
      // Add slight delay
  delay(50);
    
  }
  //////////////////////////////////////////////////////

  // Set 3
  if (prevButton4State != button4State) {
    
    if (button4State == HIGH){
      int data = 2;
      Serial.println(data);
      digitalWrite(led10, HIGH);
    }
    else
    {
      digitalWrite(led10, LOW);
    }
    prevButton4State = button4State;
      // Add slight delay
  delay(50);
    
  }
  //////////////////////////////////////////////////////

  // Set 4
  if (prevButton5State != button5State) {
    
    if (button5State == HIGH){
      int data = 3;
      Serial.println(data);
      digitalWrite(led11, HIGH);
    }
    else
    {
      digitalWrite(led11, LOW);
    }
    prevButton5State = button5State;
      // Add slight delay
  delay(50);
    
  }
  //////////////////////////////////////////////////////

  // enter button
  if (prevButton6State != button6State) {
    
    if (button6State == HIGH){
      Serial.println("ENTER");
    }
    prevButton6State = button6State;
    
  }
  //////////////////////////////////////////////////////

  
  // start button
  if (prevButton7State != button7State) {
    
    if (button7State == HIGH){
      Serial.println("START");
    }
    prevButton7State = button7State;
      // Add slight delay
  delay(50);
    
  }
  
  //////////////////////////////////////////////////////
  
if (Serial.available() > 0) {
  String receivedString = "";
  while (Serial.available () > 0) {
      receivedString += char(Serial.read());
    }

   // convert data string to array
   char charBuf[receivedString.length()+1];
   receivedString.toCharArray(charBuf, receivedString.length()+1);
   for(int i = 0; i < receivedString.length(); i++){
      String myString = String(charBuf[i]);
      int myInt = myString.toInt();
      lightLED(myInt);
   }
   receivedString = "";  
}
  
  // Add slight delay
  delay(50);
  
}
