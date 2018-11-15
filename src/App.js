import React, { Component } from 'react';
import './App.scss';
import Loading from './components/Loading'
import WeatherCard from './components/WeatherCard'

class App extends Component {
  constructor() {
    super();
    this.state = {
      dashboard: [],
      city: '',
      error: '',
      loading: false
    };
  }
  componentDidMount () {
    if (localStorage.getItem('dashboard')) {
      this.setState({
        dashboard: JSON.parse(localStorage.getItem('dashboard'))
      })
    }
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.state.dashboard.length !== prevState.dashboard.length) {
      localStorage.setItem('dashboard', JSON.stringify(this.state.dashboard))
    }
  }
  addWeather = async () => {
    let add = this.state.dashboard.find((item) => {
      return item.name === this.state.city
    })

    if (!add) {
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
        error: 'Такой город уже добавлен'
      })
    }
  }
  async getWeather () {
    let myInit = { method: 'GET' };

    let resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.state.city}&APPID=87f95bb5b741fe89ebd10a7fb4d66f0c&units=metric`, myInit)

    return resp.json()
  }
  clearWeather = () => {
    this.setState({
      dashboard: []
    })
  }
  changeInput = (e) => {
    e.preventDefault()

    if (/[A-Za-z]+[0-9]*/.test(e.target.value) || e.target.value === '') {
      this.setState({
        city: e.target.value,
        error: ''
      })
    } else {
      this.setState({
        city: e.target.value,
        error: 'В названии города могут использоваться только латинские буквы и цифры'
      })
    }
  }
  deleteDash = (e, i) => {
    let arr = this.state.dashboard
    arr.splice(i, 1)
    localStorage.setItem('dashboard', JSON.stringify(arr))

    this.setState({
      dashboard: arr
    })
  }
  render() {
    return (
      <div className="app">
        <h1 className="app-title">Weather dashboard</h1>
        { this.state.error.length > 0 && <p className="error">{this.state.error}</p> }
        <div className="input-block">
          <input
            type="text"
            className="input-block__input"
            onChange={this.changeInput}
            placeholder="Введите название города"
          />
          { this.state.error === '' && <button className="input-block__add" onClick={this.addWeather}>Add</button> }
          <button className="input-block__clear" onClick={this.clearWeather}>Clear</button>
        </div>
        {
          this.state.dashboard.length > 0 ? (
            <WeatherCard dashboard={this.state.dashboard} action={this.deleteDash}/>
          ) : (
            <h3>Dashboard is empty</h3>
          )
        }
        { this.state.loading && <Loading/> }
      </div>
    );
  }
}

export default App;
