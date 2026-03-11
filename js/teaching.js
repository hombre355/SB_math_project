// teaching.js - Animated teaching tutorials with Twinkle the Unicorn

const Teaching = {
  currentStep: 0,
  steps: [],
  onComplete: null,

  show(moduleId, onComplete) {
    this.onComplete = onComplete;
    this.currentStep = 0;
    this.steps = this._getModule(moduleId);
    if (!this.steps || this.steps.length === 0) {
      if (onComplete) onComplete();
      return;
    }
    UI.showScreen('teaching-screen');
    this._renderStep();
  },

  nextStep() {
    this.currentStep++;
    if (this.currentStep >= this.steps.length) {
      if (this.onComplete) this.onComplete();
      return;
    }
    this._renderStep();
  },

  _renderStep() {
    const step = this.steps[this.currentStep];
    const container = UI.$('#teaching-content');
    if (!container) return;

    const isLast = this.currentStep === this.steps.length - 1;
    const progress = `Step ${this.currentStep + 1} of ${this.steps.length}`;

    container.innerHTML = `
      <div class="teaching-step animate-in">
        <div class="teaching-progress">${progress}</div>
        <div class="teaching-mascot-area">
          <div class="mascot mascot-teaching" id="teaching-mascot">
            <div class="unicorn">
              <div class="unicorn-horn"></div>
              <div class="unicorn-head">
                <div class="unicorn-eye left"></div>
                <div class="unicorn-eye right"></div>
                <div class="unicorn-mouth"></div>
              </div>
              <div class="unicorn-mane"></div>
              <div class="unicorn-body"></div>
            </div>
          </div>
          <div class="speech-bubble teaching-bubble">
            <p>${step.speech}</p>
          </div>
        </div>
        <div class="teaching-visual">
          ${step.visual}
        </div>
        ${step.interactive ? `<div class="teaching-interactive">${step.interactive}</div>` : ''}
        <button class="btn btn-primary btn-large teaching-next" onclick="Teaching.nextStep()">
          ${isLast ? "Let's Practice! \uD83C\uDF1F" : "Next \u27A1\uFE0F"}
        </button>
      </div>
    `;
  },

  _getModule(moduleId) {
    const modules = {
      placeValueIntro: [
        {
          speech: "Hi Sarah-Beth! I'm Twinkle the Unicorn, and I'm going to help you learn math! Let's start with something fun - every number has a special place!",
          visual: `
            <div class="pv-demo">
              <div class="pv-number">
                <span class="pv-digit pv-ones animate-pop" style="animation-delay:0.3s">5</span>
              </div>
              <div class="pv-labels">
                <span class="pv-label pv-ones-label animate-pop" style="animation-delay:0.6s">Ones</span>
              </div>
              <div class="pv-explain">The number <strong>5</strong> sits in the <strong>Ones</strong> place!</div>
            </div>`
        },
        {
          speech: "When a number has TWO digits, the left digit sits in the Tens place. It tells us how many groups of ten we have!",
          visual: `
            <div class="pv-demo">
              <div class="pv-number">
                <span class="pv-digit pv-tens animate-pop" style="animation-delay:0.3s">2</span>
                <span class="pv-digit pv-ones animate-pop" style="animation-delay:0.5s">3</span>
              </div>
              <div class="pv-labels">
                <span class="pv-label pv-tens-label animate-pop" style="animation-delay:0.7s">Tens</span>
                <span class="pv-label pv-ones-label animate-pop" style="animation-delay:0.9s">Ones</span>
              </div>
              <div class="pv-explain"><strong>23</strong> means <strong>2</strong> tens and <strong>3</strong> ones!<br>That's 20 + 3 = 23!</div>
              <div class="pv-blocks">
                <div class="block-group tens-blocks">
                  <div class="block-ten"></div><div class="block-ten"></div>
                  <span class="block-label">2 tens = 20</span>
                </div>
                <div class="block-group ones-blocks">
                  <div class="block-one"></div><div class="block-one"></div><div class="block-one"></div>
                  <span class="block-label">3 ones = 3</span>
                </div>
              </div>
            </div>`
        },
        {
          speech: "Now let's try adding! When we add small numbers, we just count them together. Ready to try?",
          visual: `
            <div class="pv-demo">
              <div class="simple-add-demo">
                <div class="add-visual">
                  <div class="dot-group">
                    <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                    <div class="dot-label">3</div>
                  </div>
                  <div class="add-sign">+</div>
                  <div class="dot-group">
                    <span class="dot"></span><span class="dot"></span>
                    <div class="dot-label">2</div>
                  </div>
                  <div class="add-sign">=</div>
                  <div class="dot-group result">
                    <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                    <span class="dot new"></span><span class="dot new"></span>
                    <div class="dot-label">5</div>
                  </div>
                </div>
              </div>
            </div>`
        }
      ],

      carryingIntro: [
        {
          speech: "Great job getting here, Sarah-Beth! Now, what happens when two numbers add up to more than 9? We need to CARRY!",
          visual: `
            <div class="carry-demo">
              <div class="carry-example">
                <div class="carry-step">
                  <span class="carry-num">7 + 8 = ?</span>
                </div>
                <div class="carry-step animate-pop" style="animation-delay:0.5s">
                  <span class="carry-explain">7 + 8 = <strong>15</strong></span>
                </div>
                <div class="carry-step animate-pop" style="animation-delay:1s">
                  <span class="carry-explain">15 is <strong>1</strong> ten and <strong>5</strong> ones!</span>
                </div>
              </div>
            </div>`
        },
        {
          speech: "When the answer is bigger than 9, we write down the ones digit and carry the tens digit to the next column. Don't worry, you'll get the hang of it!",
          visual: `
            <div class="carry-demo">
              <div class="carry-visual">
                <div class="carry-arrow animate-pop" style="animation-delay:0.5s">
                  <span class="carried-digit">1</span>
                  <span class="carry-text">carry the 1!</span>
                </div>
                <div class="carry-columns">
                  <div class="carry-col">
                    <span class="col-header">Tens</span>
                    <span class="col-digit"></span>
                    <span class="col-digit"></span>
                    <span class="col-line"></span>
                    <span class="col-answer animate-pop" style="animation-delay:1s">1</span>
                  </div>
                  <div class="carry-col">
                    <span class="col-header">Ones</span>
                    <span class="col-digit">7</span>
                    <span class="col-digit">8</span>
                    <span class="col-line"></span>
                    <span class="col-answer animate-pop" style="animation-delay:0.8s">5</span>
                  </div>
                </div>
                <div class="carry-result animate-pop" style="animation-delay:1.2s">Answer: <strong>15</strong></div>
              </div>
            </div>`
        }
      ],

      tensColumn: [
        {
          speech: "Now we're adding a small number to a bigger number! The ones get added together first.",
          visual: `
            <div class="pv-demo">
              <div class="simple-add-demo">
                <span class="demo-problem">23 + 5 = ?</span>
                <div class="demo-breakdown">
                  <div class="demo-step animate-pop" style="animation-delay:0.3s">
                    Ones: <strong>3 + 5 = 8</strong>
                  </div>
                  <div class="demo-step animate-pop" style="animation-delay:0.7s">
                    Tens: <strong>2</strong> (stays the same!)
                  </div>
                  <div class="demo-step result animate-pop" style="animation-delay:1.1s">
                    Answer: <strong>28</strong>
                  </div>
                </div>
              </div>
            </div>`
        }
      ],

      columnAlignment: [
        {
          speech: "When we add two big numbers, we stack them in columns! Each digit goes in its own column - ones under ones, tens under tens!",
          visual: `
            <div class="column-teach-demo">
              <div class="column-example">
                <div class="ct-row">
                  <span class="ct-header ct-tens">Tens</span>
                  <span class="ct-header ct-ones">Ones</span>
                </div>
                <div class="ct-row">
                  <span class="ct-digit ct-tens animate-pop" style="animation-delay:0.3s">3</span>
                  <span class="ct-digit ct-ones animate-pop" style="animation-delay:0.5s">2</span>
                </div>
                <div class="ct-row">
                  <span class="ct-op">+</span>
                  <span class="ct-digit ct-tens animate-pop" style="animation-delay:0.7s">1</span>
                  <span class="ct-digit ct-ones animate-pop" style="animation-delay:0.9s">4</span>
                </div>
                <div class="ct-line"></div>
                <div class="ct-row">
                  <span class="ct-digit ct-tens animate-pop" style="animation-delay:1.3s">4</span>
                  <span class="ct-digit ct-ones animate-pop" style="animation-delay:1.1s">6</span>
                </div>
              </div>
              <div class="ct-explain animate-pop" style="animation-delay:1.5s">
                Ones: 2 + 4 = 6 &nbsp; | &nbsp; Tens: 3 + 1 = 4 &nbsp; | &nbsp; Answer: <strong>46</strong>
              </div>
            </div>`
        }
      ],

      carryingTwoDigit: [
        {
          speech: "Now for the real deal! When a column adds up to more than 9, we carry to the next column. Watch carefully!",
          visual: `
            <div class="column-teach-demo">
              <div class="column-example">
                <div class="ct-row">
                  <span class="ct-header ct-tens">Tens</span>
                  <span class="ct-header ct-ones">Ones</span>
                </div>
                <div class="ct-carry animate-pop" style="animation-delay:1.5s">
                  <span class="ct-carried">1</span>
                </div>
                <div class="ct-row">
                  <span class="ct-digit ct-tens">4</span>
                  <span class="ct-digit ct-ones">7</span>
                </div>
                <div class="ct-row">
                  <span class="ct-op">+</span>
                  <span class="ct-digit ct-tens">3</span>
                  <span class="ct-digit ct-ones">6</span>
                </div>
                <div class="ct-line"></div>
                <div class="ct-row">
                  <span class="ct-digit ct-tens animate-pop" style="animation-delay:2s">8</span>
                  <span class="ct-digit ct-ones animate-pop" style="animation-delay:1s">3</span>
                </div>
              </div>
              <div class="ct-steps">
                <div class="ct-step animate-pop" style="animation-delay:0.5s">Step 1: Ones: 7 + 6 = 13</div>
                <div class="ct-step animate-pop" style="animation-delay:1s">Step 2: Write 3, carry the 1!</div>
                <div class="ct-step animate-pop" style="animation-delay:1.5s">Step 3: Tens: 4 + 3 + 1 = 8</div>
                <div class="ct-step result animate-pop" style="animation-delay:2s">Answer: <strong>83</strong></div>
              </div>
            </div>`
        }
      ],

      hundredsColumn: [
        {
          speech: "Welcome to the Hundreds, Sarah-Beth! Numbers can have THREE digits now. The hundreds place is even bigger than tens!",
          visual: `
            <div class="pv-demo">
              <div class="pv-number big">
                <span class="pv-digit pv-hundreds animate-pop" style="animation-delay:0.3s">2</span>
                <span class="pv-digit pv-tens animate-pop" style="animation-delay:0.5s">3</span>
                <span class="pv-digit pv-ones animate-pop" style="animation-delay:0.7s">4</span>
              </div>
              <div class="pv-labels">
                <span class="pv-label pv-hundreds-label animate-pop" style="animation-delay:0.9s">Hundreds</span>
                <span class="pv-label pv-tens-label animate-pop" style="animation-delay:1.1s">Tens</span>
                <span class="pv-label pv-ones-label animate-pop" style="animation-delay:1.3s">Ones</span>
              </div>
              <div class="pv-explain">
                <strong>234</strong> = 2 hundreds + 3 tens + 4 ones<br>
                That's 200 + 30 + 4!
              </div>
            </div>`
        }
      ],

      thousandsColumn: [
        {
          speech: "THOUSANDS! Now we're really getting big! You're doing amazing, Sarah-Beth!",
          visual: `
            <div class="pv-demo">
              <div class="pv-number big">
                <span class="pv-digit pv-thousands animate-pop" style="animation-delay:0.2s">3</span>
                <span class="pv-digit pv-hundreds animate-pop" style="animation-delay:0.4s">4</span>
                <span class="pv-digit pv-tens animate-pop" style="animation-delay:0.6s">5</span>
                <span class="pv-digit pv-ones animate-pop" style="animation-delay:0.8s">6</span>
              </div>
              <div class="pv-labels">
                <span class="pv-label pv-thousands-label animate-pop" style="animation-delay:1s">Thousands</span>
                <span class="pv-label pv-hundreds-label animate-pop" style="animation-delay:1.2s">Hundreds</span>
                <span class="pv-label pv-tens-label animate-pop" style="animation-delay:1.4s">Tens</span>
                <span class="pv-label pv-ones-label animate-pop" style="animation-delay:1.6s">Ones</span>
              </div>
              <div class="pv-explain">
                <strong>3,456</strong> = 3 thousands + 4 hundreds + 5 tens + 6 ones!
              </div>
            </div>`
        }
      ],

      tenThousandsColumn: [
        {
          speech: "TEN THOUSANDS! Sarah-Beth, you're becoming a math champion! These are really big numbers!",
          visual: `
            <div class="pv-demo">
              <div class="pv-number big">
                <span class="pv-digit pv-tenthousands animate-pop" style="animation-delay:0.2s">2</span>
                <span class="pv-digit pv-thousands animate-pop" style="animation-delay:0.4s">3</span>
                <span class="pv-digit pv-hundreds animate-pop" style="animation-delay:0.6s">4</span>
                <span class="pv-digit pv-tens animate-pop" style="animation-delay:0.8s">5</span>
                <span class="pv-digit pv-ones animate-pop" style="animation-delay:1s">6</span>
              </div>
              <div class="pv-labels">
                <span class="pv-label animate-pop" style="animation-delay:1.2s">Ten-Thousands</span>
                <span class="pv-label animate-pop" style="animation-delay:1.4s">Thousands</span>
                <span class="pv-label animate-pop" style="animation-delay:1.6s">Hundreds</span>
                <span class="pv-label animate-pop" style="animation-delay:1.8s">Tens</span>
                <span class="pv-label animate-pop" style="animation-delay:2s">Ones</span>
              </div>
              <div class="pv-explain">
                <strong>23,456</strong> = 20,000 + 3,000 + 400 + 50 + 6!
              </div>
            </div>`
        }
      ],

      additionMastery: [
        {
          speech: "Sarah-Beth, you've learned ALL of addition! From tiny numbers to huge ones! Now for the ultimate addition challenge - a mix of everything!",
          visual: `
            <div class="mastery-demo">
              <div class="trophy animate-pop">\uD83C\uDFC6</div>
              <h2>Addition Master!</h2>
              <p>You can add numbers all the way up to the ten-thousands!</p>
              <p>This final addition level will mix up all different sizes. Show me what you've got!</p>
            </div>`
        }
      ],

      subtractionIntro: [
        {
          speech: "Time for something new! Subtraction means taking away. If you have 8 apples and eat 3, how many are left?",
          visual: `
            <div class="pv-demo">
              <div class="simple-add-demo">
                <div class="add-visual">
                  <div class="dot-group">
                    <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                    <span class="dot"></span><span class="dot"></span>
                    <span class="dot fading"></span><span class="dot fading"></span><span class="dot fading"></span>
                    <div class="dot-label">8 - 3</div>
                  </div>
                  <div class="add-sign">=</div>
                  <div class="dot-group result">
                    <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                    <span class="dot"></span><span class="dot"></span>
                    <div class="dot-label">5</div>
                  </div>
                </div>
                <p class="demo-text">8 minus 3 equals 5! We took away 3 dots.</p>
              </div>
            </div>`
        }
      ],

      columnSubtraction: [
        {
          speech: "Just like addition, we can stack subtraction in columns! The bigger number goes on top.",
          visual: `
            <div class="column-teach-demo">
              <div class="column-example">
                <div class="ct-row">
                  <span class="ct-header ct-tens">Tens</span>
                  <span class="ct-header ct-ones">Ones</span>
                </div>
                <div class="ct-row">
                  <span class="ct-digit ct-tens">5</span>
                  <span class="ct-digit ct-ones">8</span>
                </div>
                <div class="ct-row">
                  <span class="ct-op">&minus;</span>
                  <span class="ct-digit ct-tens">2</span>
                  <span class="ct-digit ct-ones">3</span>
                </div>
                <div class="ct-line"></div>
                <div class="ct-row">
                  <span class="ct-digit ct-tens animate-pop" style="animation-delay:1s">3</span>
                  <span class="ct-digit ct-ones animate-pop" style="animation-delay:0.5s">5</span>
                </div>
              </div>
              <div class="ct-steps">
                <div class="ct-step animate-pop" style="animation-delay:0.3s">Ones: 8 - 3 = 5</div>
                <div class="ct-step animate-pop" style="animation-delay:0.8s">Tens: 5 - 2 = 3</div>
                <div class="ct-step result animate-pop" style="animation-delay:1.2s">Answer: <strong>35</strong></div>
              </div>
            </div>`
        }
      ],

      borrowingIntro: [
        {
          speech: "Uh oh! What if the top digit is smaller than the bottom digit? We need to BORROW from the next column!",
          visual: `
            <div class="column-teach-demo">
              <div class="column-example">
                <div class="ct-row">
                  <span class="ct-header ct-tens">Tens</span>
                  <span class="ct-header ct-ones">Ones</span>
                </div>
                <div class="ct-borrow animate-pop" style="animation-delay:1s">
                  <span class="ct-borrow-from">5 becomes 4</span>
                  <span class="ct-borrow-to">2 becomes 12!</span>
                </div>
                <div class="ct-row">
                  <span class="ct-digit ct-tens"><s>5</s> 4</span>
                  <span class="ct-digit ct-ones"><s>2</s> 12</span>
                </div>
                <div class="ct-row">
                  <span class="ct-op">&minus;</span>
                  <span class="ct-digit ct-tens">3</span>
                  <span class="ct-digit ct-ones">7</span>
                </div>
                <div class="ct-line"></div>
                <div class="ct-row">
                  <span class="ct-digit ct-tens animate-pop" style="animation-delay:2s">1</span>
                  <span class="ct-digit ct-ones animate-pop" style="animation-delay:1.5s">5</span>
                </div>
              </div>
              <div class="ct-steps">
                <div class="ct-step animate-pop" style="animation-delay:0.3s">Ones: 2 is less than 7... we need to borrow!</div>
                <div class="ct-step animate-pop" style="animation-delay:0.8s">Borrow 1 ten: 5 tens becomes 4 tens</div>
                <div class="ct-step animate-pop" style="animation-delay:1.2s">2 ones becomes 12 ones!</div>
                <div class="ct-step animate-pop" style="animation-delay:1.6s">Now: 12 - 7 = 5, and 4 - 3 = 1</div>
                <div class="ct-step result animate-pop" style="animation-delay:2s">Answer: <strong>15</strong></div>
              </div>
            </div>`
        }
      ],

      borrowingAcrossZeros: [
        {
          speech: "Tricky! What if there's a zero in the middle? We borrow from the next column that has something to give!",
          visual: `
            <div class="column-teach-demo">
              <div class="column-example">
                <div class="ct-row">
                  <span class="ct-header">H</span>
                  <span class="ct-header">T</span>
                  <span class="ct-header">O</span>
                </div>
                <div class="ct-row">
                  <span class="ct-digit"><s>3</s> 2</span>
                  <span class="ct-digit"><s>0</s> 9</span>
                  <span class="ct-digit"><s>5</s> 15</span>
                </div>
                <div class="ct-row">
                  <span class="ct-op">&minus;</span>
                  <span class="ct-digit">1</span>
                  <span class="ct-digit">6</span>
                  <span class="ct-digit">8</span>
                </div>
                <div class="ct-line"></div>
                <div class="ct-row">
                  <span class="ct-digit animate-pop" style="animation-delay:1.5s">1</span>
                  <span class="ct-digit animate-pop" style="animation-delay:1.2s">3</span>
                  <span class="ct-digit animate-pop" style="animation-delay:0.8s">7</span>
                </div>
              </div>
              <div class="ct-steps">
                <div class="ct-step">Can't take 8 from 5, and can't borrow from 0!</div>
                <div class="ct-step">So we borrow from hundreds: 3\u21922, 0\u21929, 5\u219215</div>
                <div class="ct-step result">305 - 168 = <strong>137</strong></div>
              </div>
            </div>`
        }
      ],

      subtractionMastery: [
        {
          speech: "Sarah-Beth, you've conquered subtraction too! You're a TRUE math champion! This is the final challenge!",
          visual: `
            <div class="mastery-demo">
              <div class="trophy animate-pop">\uD83C\uDFC6\uD83E\uDD84\uD83C\uDFC6</div>
              <h2>Math Master!</h2>
              <p>You can add AND subtract huge numbers!</p>
              <p>This is the ultimate level. You're ready!</p>
            </div>`
        }
      ]
    };

    return modules[moduleId] || [];
  }
};
