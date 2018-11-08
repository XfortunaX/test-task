import React, { Component } from 'react';
import './App.scss';
import Loading from './components/Loading'

class App extends Component {
  constructor() {
    super();
    this.state = {
      dashboard: [],
      appid: '87f95bb5b741fe89ebd10a7fb4d66f0c',
      city: 'London',
      units: 'metric',
      error: '',
      loading: false
    };

    this.changeInput = this.changeInput.bind(this);
    this.addWeather = this.addWeather.bind(this);
    this.clearWeather = this.clearWeather.bind(this);
  }
  componentDidMount () {
    if (localStorage.getItem('dashboard')) {
      this.setState({
        dashboard: JSON.parse(localStorage.getItem('dashboard'))
      })
    }
  }
  async addWeather() {
    if (/[A-Za-z0-9]+/.test(this.state.city)) {
      this.setState({
        loading: true
      })

      let answer = await this.getWeather()

      if (answer.cod === 200) {
        this.setState({
          dashboard: [...this.state.dashboard, {
            name: answer.name,
            temperature: answer.main.temp,
            icon: answer.weather[0].icon
          }]
        })
      } else {
        this.setState({
          error: 'Ошибка в названии города'
        })
      }

      this.setState({
        loading: false
      })
    } else {
      this.setState({
        error: 'В названии города могут использоваться только латинские буквы и цифры'
      })
    }
  }
  async getWeather () {
    let myInit = { method: 'GET' };

    let resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.state.city}&APPID=${this.state.appid}&units=${this.state.units}`, myInit)

    return await resp.json()
  }
  clearWeather () {
    this.setState({
      dashboard: []
    })
  }
  changeInput (e) {
    e.preventDefault()

    this.setState({
      city: e.target.value,
      error: ''
    })
  }
  deleteDash (e, i) {
    let arr = this.state.dashboard
    arr.splice(i, 1)

    this.setState({
      dashboard: arr
    })
  }
  createDashboard() {
    localStorage.setItem('dashboard', JSON.stringify(this.state.dashboard))

    const listItems = this.state.dashboard.map((item, i) =>
      <div className="city-weather" key={i} onMouseEnter={this.showDelete} onMouseLeave={this.hideDelete}>
        <button className="city-weather__delete" onClick={ (e) => this.deleteDash(e, i)}>delete</button>
        <p className="city-weather__name">{item.name}</p>
        <p className="city-weather__temperature">{item.temperature > 0 ? '+' : ''}{item.temperature} <sup>o</sup>C</p>
        <img className="city-weather__icon" src={`http://openweathermap.org/img/w/${item.icon}.png`} alt=""/>
      </div>
    );

    return (
      <div className="dashboard">{listItems}</div>
    );
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="app-title">Weather dashboard</h1>
          { this.state.error.length > 0 && <p className="error">{this.state.error}</p> }
          <div className="input-block">
            <input
              type="text"
              className="input-block__input"
              onChange={this.changeInput}
              placeholder="Введите название города"
            />
            <button className="input-block__add" onClick={this.addWeather}>Add</button>
            <button className="input-block__clear" onClick={this.clearWeather}>Clear</button>
          </div>
          {
            this.state.dashboard.length > 0 ? (
              this.createDashboard()
            ) : (
              <h3>Dashboard is empty</h3>
            )
          }
          { this.state.loading && <Loading/> }
        </header>
      </div>
    );
  }
}

export default App;
