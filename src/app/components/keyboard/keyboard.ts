import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-keyboard',
  imports: [],
  templateUrl: './keyboard.html',
  styleUrl: './keyboard.css',
})
export class Keyboard {
  @Input() letterCondition = new Map<string, string>();
  @Output() letterPressed = new EventEmitter<string>();

  keyboard = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L','Ñ'],
    ['bi-check2','Z','X','C','V','B','N','M','bi-backspace-fill']
  ];

  press(letter: string) {
    this.letterPressed.emit(letter);
  }
}