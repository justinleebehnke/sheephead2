import React, { Component } from "react";
import Card from "./Card";
import "./Hand.css";

type Props = {
  cardsInHand: string[];
};

class Hand extends Component<Props, {}> {
  render() {
    return (
      <div id="hand">
        {this.props.cardsInHand.map((cardName) => (
          <Card card={cardName} />
        ))}
      </div>
    );
  }
}

export default Hand;
