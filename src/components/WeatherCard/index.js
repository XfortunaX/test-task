import React, { Component } from 'react';
import './style.scss';

class WeatherCard extends Component {
  render() {
    const listItems = this.props.dashboard.map((item, i) =>
      <div className="city-weather" key={i}>
        <button className="city-weather__delete" onClick={ (e) => this.props.action(e, i)}>delete</button>
        <p className="city-weather__name">{item.name}</p>
        <p className="city-weather__temperature">{item.temperature > 0 ? '+' : ''}{item.temperature.toFixed(1)} <sup>o</sup>C</p>
        <img className="city-weather__icon" src={`http://openweathermap.org/img/w/${item.icon}.png`} alt=""/>
      </div>
    );

    return (
      <div className="dashboard">{listItems}</div>
    );
  }
}

export default WeatherCard;
