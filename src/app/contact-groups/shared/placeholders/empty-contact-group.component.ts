import { Component, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'app-contact-groups-placeholder',
  template: `
    <div class="wrapper--redacted">
      <ol class="cards cards--marginBottom">
        <li>
          <div class="card">
            <div class="card__body">
              <ol class="list">
                <li class="title">
                  <span>
                    <sup>
                      <span class="pill pill--positive redacted"></span>
                      <span class="pill pill--negative redacted"></span>
                    </sup>
                    <p class="txt--title"><span class="redacted"></span></p>
                    <small>
                      <span class="txt--positive redacted redacted--50pc"></span>
                    </small>
                  </span>
                </li>
                <li class="expandable">
                  <details onclick="return false;" open="">
                    <summary>
                      <div class="summary__title">
                        <span class="redacted redacted--90pc"></span>
                        <svg
                          aria-hidden="true"
                          width="64"
                          height="64"
                          viewBox="0 0 64 64"
                          class="icon icon--s flexRight"
                        >
                          <path
                            d="M61 28H3c-1.7 0-3 1.8-3 3.5v1.1C0 34.2 1.3 36 3 36h58c1.7 0 3-1.8 3-3.5v-1C64 29.8 62.7 28 61 28z"
                            class="vertical"
                          ></path>
                          <path
                            d="M36 61V3c0-1.7-1.8-3-3.5-3l-1.1 0C29.8 0 28 1.3 28 3v58c0 1.7 1.8 3 3.5 3h1C34.2 64 36 62.7 36 61z"
                            class="horizontal"
                          ></path>
                        </svg>
                      </div>
                    </summary>
                    <ol class="list">
                      <li>
                        <svg aria-hidden="true" width="64" height="64" viewBox="0 0 64 64" class="icon icon--onLeft">
                          <path
                            d="M56 24c0 17.5-20.3 38-21.2 38.8C34 63.6 33 64 32 64c-1 0-2-0.4-2.8-1.2C28.3 62 8 41.5 8 24 8 10.8 18.8 0 32 0S56 10.8 56 24zM32 36c6.6 0 12-5.4 12-12 0-6.6-5.4-12-12-12s-12 5.4-12 12C20 30.6 25.4 36 32 36z"
                          ></path>
                        </svg>
                        <span class="redacted redacted--50pc"></span>
                        <span class="redacted redacted--10pc"></span>
                        <span class="redacted redacted--50pc"></span>
                      </li>
                      <li>
                        <ol class="list">
                          <li>
                            <svg
                              aria-hidden="true"
                              width="64"
                              height="64"
                              viewBox="0 0 64 64"
                              class="icon icon--onLeft"
                            >
                              <path
                                d="M57.6 43.2c-4 0-7.8-0.6-11.4-1.8 -1.1-0.4-2.4-0.1-3.3 0.8l-7 7c-9.1-4.6-16.5-12-21.1-21.1l7-7.1c0.9-0.8 1.2-2.1 0.8-3.2 -1.2-3.6-1.8-7.4-1.8-11.4 0-1.8-1.4-3.2-3.2-3.2H6.4c-1.8 0-3.2 1.4-3.2 3.2 0 30 24.4 54.4 54.4 54.4 1.8 0 3.2-1.4 3.2-3.2V46.4C60.8 44.6 59.4 43.2 57.6 43.2z"
                              ></path>
                            </svg>
                            <span class="redacted redacted--70pc"></span>
                          </li>
                        </ol>
                      </li>
                      <li>
                        <ol class="list">
                          <li class="txt--breakword">
                            <svg
                              aria-hidden="true"
                              width="64"
                              height="64"
                              viewBox="0 0 64 64"
                              class="icon icon--onLeft"
                            >
                              <path
                                d="M-0.3 13.8v-3.6c0-1.1 0.9-2.1 2.1-2.1h59.9c1.1 0 2.1 0.9 2.1 2.1v3.6l-32 20L-0.3 13.8zM32.8 37.9c-0.3 0.2-0.7 0.3-1.1 0.3 -0.4 0-0.7-0.1-1.1-0.3L-0.3 18.5v35.6c0 1.1 0.9 2.1 2.1 2.1h59.9c1.1 0 2.1-0.9 2.1-2.1V18.5L32.8 37.9z"
                              ></path>
                            </svg>
                            <span class="redacted redacted--50pc"></span>
                          </li>
                        </ol>
                      </li>
                    </ol>
                  </details>
                </li>

                <li class="expandable">
                  <details onclick="return false;">
                    <summary>
                      <div class="summary__title">
                        <span class="redacted redacted--50pc"></span>
                        <svg
                          aria-hidden="true"
                          width="64"
                          height="64"
                          viewBox="0 0 64 64"
                          class="icon icon--s flexRight"
                        >
                          <path
                            d="M61 28H3c-1.7 0-3 1.8-3 3.5v1.1C0 34.2 1.3 36 3 36h58c1.7 0 3-1.8 3-3.5v-1C64 29.8 62.7 28 61 28z"
                            class="vertical"
                          ></path>
                          <path
                            d="M36 61V3c0-1.7-1.8-3-3.5-3l-1.1 0C29.8 0 28 1.3 28 3v58c0 1.7 1.8 3 3.5 3h1C34.2 64 36 62.7 36 61z"
                            class="horizontal"
                          ></path>
                        </svg>
                      </div>
                    </summary>
                  </details>
                </li>

                <li class="expandable">
                  <details onclick="return false;">
                    <summary>
                      <div class="summary__title">
                        <span class="redacted redacted--90pc"></span>
                        <svg
                          aria-hidden="true"
                          width="64"
                          height="64"
                          viewBox="0 0 64 64"
                          class="icon icon--s flexRight"
                        >
                          <path
                            d="M61 28H3c-1.7 0-3 1.8-3 3.5v1.1C0 34.2 1.3 36 3 36h58c1.7 0 3-1.8 3-3.5v-1C64 29.8 62.7 28 61 28z"
                            class="vertical"
                          ></path>
                          <path
                            d="M36 61V3c0-1.7-1.8-3-3.5-3l-1.1 0C29.8 0 28 1.3 28 3v58c0 1.7 1.8 3 3.5 3h1C34.2 64 36 62.7 36 61z"
                            class="horizontal"
                          ></path>
                        </svg>
                      </div>
                    </summary>
                  </details>
                </li>

                <li class="expandable">
                  <details onclick="return false;">
                    <summary>
                      <div class="summary__title">
                        <span class="redacted redacted--70pc"></span>
                        <svg
                          aria-hidden="true"
                          width="64"
                          height="64"
                          viewBox="0 0 64 64"
                          class="icon icon--s flexRight"
                        >
                          <path
                            d="M61 28H3c-1.7 0-3 1.8-3 3.5v1.1C0 34.2 1.3 36 3 36h58c1.7 0 3-1.8 3-3.5v-1C64 29.8 62.7 28 61 28z"
                            class="vertical"
                          ></path>
                          <path
                            d="M36 61V3c0-1.7-1.8-3-3.5-3l-1.1 0C29.8 0 28 1.3 28 3v58c0 1.7 1.8 3 3.5 3h1C34.2 64 36 62.7 36 61z"
                            class="horizontal"
                          ></path>
                        </svg>
                      </div>
                    </summary>
                  </details>
                </li>
              </ol>
            </div>
          </div>
        </li>

        <li>
          <div class="card">
            <div class="card__body">
              <ol class="list">
                <li class="title">
                  <span>
                    <sup>
                      <span class="pill pill--negative redacted"></span>
                    </sup>
                    <p class="txt--title"><span class="redacted redacted--50pc"></span></p>
                    <small>
                      <span class="txt--positive redacted redacted--70pc"></span>
                    </small>
                  </span>
                </li>
                <li class="expandable">
                  <details onclick="return false;" open="">
                    <summary>
                      <div class="summary__title">
                        <span class="redacted redacted--90pc"></span>
                        <svg
                          aria-hidden="true"
                          width="64"
                          height="64"
                          viewBox="0 0 64 64"
                          class="icon icon--s flexRight"
                        >
                          <path
                            d="M61 28H3c-1.7 0-3 1.8-3 3.5v1.1C0 34.2 1.3 36 3 36h58c1.7 0 3-1.8 3-3.5v-1C64 29.8 62.7 28 61 28z"
                            class="vertical"
                          ></path>
                          <path
                            d="M36 61V3c0-1.7-1.8-3-3.5-3l-1.1 0C29.8 0 28 1.3 28 3v58c0 1.7 1.8 3 3.5 3h1C34.2 64 36 62.7 36 61z"
                            class="horizontal"
                          ></path>
                        </svg>
                      </div>
                    </summary>
                    <ol class="list">
                      <li>
                        <svg aria-hidden="true" width="64" height="64" viewBox="0 0 64 64" class="icon icon--onLeft">
                          <path
                            d="M56 24c0 17.5-20.3 38-21.2 38.8C34 63.6 33 64 32 64c-1 0-2-0.4-2.8-1.2C28.3 62 8 41.5 8 24 8 10.8 18.8 0 32 0S56 10.8 56 24zM32 36c6.6 0 12-5.4 12-12 0-6.6-5.4-12-12-12s-12 5.4-12 12C20 30.6 25.4 36 32 36z"
                          ></path>
                        </svg>
                        <span class="redacted redacted--50pc"></span>
                        <span class="redacted redacted--20pc"></span>
                      </li>
                      <li>
                        <ol class="list">
                          <li>
                            <svg
                              aria-hidden="true"
                              width="64"
                              height="64"
                              viewBox="0 0 64 64"
                              class="icon icon--onLeft"
                            >
                              <path
                                d="M57.6 43.2c-4 0-7.8-0.6-11.4-1.8 -1.1-0.4-2.4-0.1-3.3 0.8l-7 7c-9.1-4.6-16.5-12-21.1-21.1l7-7.1c0.9-0.8 1.2-2.1 0.8-3.2 -1.2-3.6-1.8-7.4-1.8-11.4 0-1.8-1.4-3.2-3.2-3.2H6.4c-1.8 0-3.2 1.4-3.2 3.2 0 30 24.4 54.4 54.4 54.4 1.8 0 3.2-1.4 3.2-3.2V46.4C60.8 44.6 59.4 43.2 57.6 43.2z"
                              ></path>
                            </svg>
                            <span class="redacted redacted--70pc"></span>
                          </li>
                        </ol>
                      </li>
                      <li>
                        <ol class="list">
                          <li class="txt--breakword">
                            <svg
                              aria-hidden="true"
                              width="64"
                              height="64"
                              viewBox="0 0 64 64"
                              class="icon icon--onLeft"
                            >
                              <path
                                d="M-0.3 13.8v-3.6c0-1.1 0.9-2.1 2.1-2.1h59.9c1.1 0 2.1 0.9 2.1 2.1v3.6l-32 20L-0.3 13.8zM32.8 37.9c-0.3 0.2-0.7 0.3-1.1 0.3 -0.4 0-0.7-0.1-1.1-0.3L-0.3 18.5v35.6c0 1.1 0.9 2.1 2.1 2.1h59.9c1.1 0 2.1-0.9 2.1-2.1V18.5L32.8 37.9z"
                              ></path>
                            </svg>
                            <span class="redacted redacted--50pc"></span>
                          </li>
                        </ol>
                      </li>
                    </ol>
                  </details>
                </li>

                <li class="expandable">
                  <details onclick="return false;">
                    <summary>
                      <div class="summary__title">
                        <span class="redacted redacted--50pc"></span>
                        <svg
                          aria-hidden="true"
                          width="64"
                          height="64"
                          viewBox="0 0 64 64"
                          class="icon icon--s flexRight"
                        >
                          <path
                            d="M61 28H3c-1.7 0-3 1.8-3 3.5v1.1C0 34.2 1.3 36 3 36h58c1.7 0 3-1.8 3-3.5v-1C64 29.8 62.7 28 61 28z"
                            class="vertical"
                          ></path>
                          <path
                            d="M36 61V3c0-1.7-1.8-3-3.5-3l-1.1 0C29.8 0 28 1.3 28 3v58c0 1.7 1.8 3 3.5 3h1C34.2 64 36 62.7 36 61z"
                            class="horizontal"
                          ></path>
                        </svg>
                      </div>
                    </summary>
                  </details>
                </li>

                <li class="expandable">
                  <details onclick="return false;">
                    <summary>
                      <div class="summary__title">
                        <span class="redacted redacted--90pc"></span>
                        <svg
                          aria-hidden="true"
                          width="64"
                          height="64"
                          viewBox="0 0 64 64"
                          class="icon icon--s flexRight"
                        >
                          <path
                            d="M61 28H3c-1.7 0-3 1.8-3 3.5v1.1C0 34.2 1.3 36 3 36h58c1.7 0 3-1.8 3-3.5v-1C64 29.8 62.7 28 61 28z"
                            class="vertical"
                          ></path>
                          <path
                            d="M36 61V3c0-1.7-1.8-3-3.5-3l-1.1 0C29.8 0 28 1.3 28 3v58c0 1.7 1.8 3 3.5 3h1C34.2 64 36 62.7 36 61z"
                            class="horizontal"
                          ></path>
                        </svg>
                      </div>
                    </summary>
                  </details>
                </li>

                <li class="expandable">
                  <details onclick="return false;">
                    <summary>
                      <div class="summary__title">
                        <span class="redacted redacted--70pc"></span>
                        <svg
                          aria-hidden="true"
                          width="64"
                          height="64"
                          viewBox="0 0 64 64"
                          class="icon icon--s flexRight"
                        >
                          <path
                            d="M61 28H3c-1.7 0-3 1.8-3 3.5v1.1C0 34.2 1.3 36 3 36h58c1.7 0 3-1.8 3-3.5v-1C64 29.8 62.7 28 61 28z"
                            class="vertical"
                          ></path>
                          <path
                            d="M36 61V3c0-1.7-1.8-3-3.5-3l-1.1 0C29.8 0 28 1.3 28 3v58c0 1.7 1.8 3 3.5 3h1C34.2 64 36 62.7 36 61z"
                            class="horizontal"
                          ></path>
                        </svg>
                      </div>
                    </summary>
                  </details>
                </li>
              </ol>
            </div>
          </div>
        </li>

        <li class="card__new" *ngIf="showAddNewBtn">
          <a href (click)="onAddPerson.emit($event)" class="overall"></a>
          <svg aria-hidden="true" width="64" height="64" viewBox="0 0 64 64" class="icon icon--l">
            <path
              d="M60 35.9H4c-2.2 0-4-1.8-4-4v0c0-2.2 1.8-4 4-4h56c2.2 0 4 1.8 4 4v0C64 34.1 62.2 35.9 60 35.9z"
            ></path>
            <path
              d="M28 59.9v-56c0-2.2 1.8-4 4-4h0c2.2 0 4 1.8 4 4v56c0 2.2-1.8 4-4 4h0C29.8 63.9 28 62.2 28 59.9z"
              class="plus-vertical"
            ></path>
          </svg>
          Add Person
        </li>
      </ol>
    </div>
  `
})
export class EmptyContactGroupPlaceholderComponent {
  @Input() showAddNewBtn: boolean
  @Output() onAddPerson: EventEmitter<any> = new EventEmitter()
}
