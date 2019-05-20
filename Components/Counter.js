class Counter extends HTMLElement {
	constructor() {
		super();
		this.counter = 1;
		this.maxValue = 10;
		this.minValue = 0;
		this.maxValueErrorMessage = document.createTextNode(
			`Alleen waarden kleiner dan ${this.maxValue}`
		);
		this.minValueErrorMessage = document.createTextNode(
			`Alleen waarden groter dan ${this.minValue}`
		);
		this.slidingMessage = document.createElement("div");
		this.slidingMessage.setAttribute("class", "slideMessage");

		this.dismissButton = document.createElement("button");
		this.dismissButton.appendChild(document.createTextNode("Go away"));
		this.dismissButton.setAttribute("class", "sliderButton");

		const shadowRoot = this.attachShadow({ mode: "open" });
		shadowRoot.innerHTML = `
		<style>
			@import '../index.css';
		</style>
		<div class='counter'>
		<button class="decrementButton">&dash;</button>
			<span class="counter"><span type='counter'>${this.counter}</span> ${
			this.counter > 1 ? "minuten" : "minuut"
		} tot start</span>
			<button class="incrementButton">&plus;</button>
		</div>
		`;
		this.shadow = shadowRoot;

		this.dismissButton.addEventListener("click", e =>
			this.shadow.removeChild(this.slidingMessage)
		);
	}

	updateCounter(unit) {
		const error =
			(this.counter === this.minValue && unit === -1) ||
			(this.counter === this.maxValue && unit === 1);

		let errorMessage =
			this.counter === this.maxValue
				? this.maxValueErrorMessage
				: this.minValueErrorMessage;

		this.counter = error ? this.counter : this.counter + unit;

		if (error) {
			this.slidingMessage.appendChild(errorMessage);
			this.slidingMessage.appendChild(this.dismissButton);
			this.shadow.appendChild(this.slidingMessage);
		} else {
			this.shadow.querySelector(
				"[type=counter]"
			).innerHTML = this.counter;
			this.slidingMessage.removeChild(errorMessage);
			this.shadow.removeChild(this.slidingMessage);
		}
	}

	connectedCallback() {
		this.addEventListener("click", e => {
			const el = e.path[0].className;
			switch (el) {
				case "incrementButton":
					this.updateCounter(1);
					return;
				case "decrementButton":
					this.updateCounter(-1);
					return;
			}
		});
	}

	static get observedAttributes() {
		return ["counter", "step"];
	}

	attributeChangedCallback(attr, oldValue, newValue) {
		switch (attr) {
			case "counter":
				this.counter = newValue;
				this.log(
					`this.start gewijzigd van ${oldValue} naar ${newValue}`
				);
				return;
			case "step":
				this.step = newValue;
				this.log(
					`this.step gewijzigd van ${oldValue} naar ${newValue}`
				);
				return;
		}
	}
}

export default Counter;
