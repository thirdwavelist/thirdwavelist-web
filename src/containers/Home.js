import React, { Component } from "react";
import { Col, Button, Form, FormGroup, Input } from "reactstrap";
import { Box, Container } from 'reactbulma'
import Columns from 'react-bulma-components/lib/components/columns';
import { invokeApig } from "../libs/awsLib";
import "./Home.css";
import config from "../config";

/* global location */
/* eslint no-restricted-globals: ["off", "location"] */

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      cafes: [],
      filterText: "",
      methodFilter: null,
      beanFilter: null,
      locationFilter: null,
      beanDropdownOpen: false,
      methodDropdownOpen: false,
      email: ""
    };

    this.toggleBeanDropdown = this.toggleBeanDropdown.bind(this);
    this.toggleMethodDropdown = this.toggleMethodDropdown.bind(this);
    this.filterList = this.filterList.bind(this);
    this.setBeanType = this.setBeanType.bind(this);
    this.setMethodType = this.setMethodType.bind(this);
    this.setLocation = this.setLocation.bind(this);
    this.clear = this.clear.bind(this);
    this.getOrigin = this.getOrigin.bind(this);
    this.getRoastProfile = this.getRoastProfile.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.subscribe = this.subscribe.bind(this)
  }

  async componentDidMount() {
    try {
      const results = await this.cafes();
      this.setState({ cafes: results });
    } catch (e) {
      console.log(e);
    }

    this.setState({ isLoading: false });
  }

  subscribe() {
    if (this.state.email !== null && this.state.email.length > 0) {
      this.setState({ email: "" });
      invokeApig({
        path: "/email",
        method: "POST",
        headers: { "x-api-key": config.apiGateway.API_KEY },
        body: { "email": this.state.email }
      });
      location.href="/"
    }
  }

  cafes() {
    return invokeApig({
      path: "/cafe",
      method: "GET",
      headers: { "x-api-key": config.apiGateway.API_KEY }
    });
  }

  renderCafeList(cafes) {
    if (cafes.length > 0) {
      return cafes.map((cafe) =>
        <Col lg="3" key={cafe.uid} className="resultsCard">
          <div className="imageCard" onClick={() => {location.href=this.getLinkFrom(cafe)}}>
            <img src={cafe.extra_thumbnail} alt="Thumbnail" />
            <span className="imageTitle">{cafe.name}</span>
            <div className="after">
              <div className="center">
                <span className="floatLeft"><b>Roast profile: </b></span> <span className="floatRight">{this.getRoastProfile(cafe)}</span>
                <span className="floatLeft"><b>Roaster: </b></span> <span className="floatRight">{cafe.bean_roaster}</span>
                <span className="floatLeft"><b>Origin: </b></span> <span className="floatRight">{this.getOrigin(cafe)}</span>
                {this.getEspresso(cafe)}
                {this.getGrinder(cafe)}
                {this.getPourOver(cafe)}
                {this.getFullImmersion(cafe)}
              </div>
            </div>
          </div>
        </Col>
      );
    } else {
      return <Col key="error"><div className="noResultsText"><p className="header">Something must be wrong on our end, but we haven't found any cafés matching your criterias!</p><Button outline color="secondary" onClick={this.clear}>Clear</Button></div></Col>
    }
  }

  getGrinder(cafe) {
    if (cafe.gear_grinder !== null && cafe.gear_grinder.length > 1) {
      return <div><span className="floatLeft"><b>Grinder: </b></span> <span className="floatRight">{cafe.gear_grinder}</span></div>
    }
  }

  getEspresso(cafe) {
    if (cafe.brew_method_espresso && cafe.gear_espressomachine !== null && cafe.gear_espressomachine.length > 1) {
      return <div><span className="floatLeft"><b>Espresso: </b></span> <span className="floatRight">{cafe.gear_espressomachine}</span></div>
    }
    return
  }

  getPourOver(cafe) {
    if (cafe.brew_method_pourover) {
      return <div><span className="floatLeft"><b>Pour-over: </b></span> <span className="floatRight">{cafe.gear_pourover}</span></div>
    }
  }

  getFullImmersion(cafe) {
    if (cafe.brew_method_fullimmersion) {
      return <div><span className="floatLeft"><b>Immersive: </b></span> <span className="floatRight"> {cafe.gear_immersive}</span></div>
    }
    return;
  }

  getLinkFrom(cafe) {
    if (cafe.social_facebook !== null || cafe.social_facebook.length >= 1) {
      return cafe.social_facebook;
    } else if (cafe.social_instagram !== null || cafe.social_instagram.length >= 1) {
      return cafe.social_instagram
    } else if (cafe.social_website !== null || cafe.social_website.length >= 1) {
      return cafe.social_website
    } else {
      return "#"
    }
  }

  clear() {
    this.setState({
      filterText: "",
      beanFilter: null,
      methodFilter: null,
      locationFilter: null,
      beanDropdownOpen: false,
      methodDropdownOpen: false
    })
  }

  handleEmailChange(event) {
    this.setState({email: event.target.value.toLowerCase()});    
  }

  filterList(event) {
    this.setState({ filterText: event.target.value });
  }
  setLocation(location) {
    this.setState({ locationFilter: location })
  }
  setBeanType(event) {
    this.setState({ beanFilter: { value: event.target.getAttribute('data-arg1'), label: event.target.getAttribute('data-arg2') } })
  }
  setMethodType(event) {
    this.setState({ methodFilter: { value: event.target.getAttribute('data-arg1'), label: event.target.getAttribute('data-arg2') } })
  }

  getRoastProfile(cafe) {
    var results = []
    if (cafe.bean_roast_light) results.push("Light")
    if (cafe.bean_roast_medium) results.push("Medium")
    if (cafe.bean_roast_dark) results.push("Dark")
    
    if (results.length <= 1) {
      return results.join();
    } else {
      return results.slice(0, -1).join(", ") + " and " + results[results.length-1];
    }
  }

  getOrigin(cafe) {
    if (cafe.bean_origin_single && cafe.bean_origin_blend) return "Single & Blend" 
    else if (cafe.bean_origin_single) return "Single"
    else if (cafe.bean_origin_blend) return "Blend"
    else return "Unknown"
  }

  toggleBeanDropdown() {
    this.setState({
      beanDropdownOpen: !this.state.beanDropdownOpen,
      methodDropdownOpen: false
    });
  }
  toggleMethodDropdown() {
    this.setState({
      methodDropdownOpen: !this.state.methodDropdownOpen,
      beanDropdownOpen: false
    });
  }

  render() {
    let _cafes = this.state.cafes;

    let _beanFilter = this.state.beanFilter;
    let _methodFilter = this.state.methodFilter;
    let _search = this.state.filterText.trim().toLowerCase();

    if (_beanFilter !== null && _beanFilter.value.length > 0) {
      // eslint-disable-next-line
      _cafes.filter(function (cafe) {
        if (_beanFilter.value === "all") {
          return true || false
        } else if (_beanFilter.value === "bean_roast_light") {
          return cafe.bean_roast_light;
        } else if (_beanFilter.value === "bean_roast_medium") {
          return cafe.bean_roast_medium;
        } else if (_beanFilter.value === "bean_roast_dark") {
          return cafe.bean_roast_dark;
        }
      });    
    }

    if (_methodFilter !== null && _methodFilter.value.length > 0) {
      // eslint-disable-next-line
      _cafes.filter(function (cafe) {
        if (_methodFilter.value === "all") {
          return true || false
        } else if (_methodFilter.value === "brew_method_espresso") {
          return cafe.brew_method_espresso;
        } else if (_methodFilter.value === "brew_method_aeropress") {
          return cafe.brew_method_aeropress;
        } else if (_methodFilter.value === "brew_method_pourover") {
          return cafe.brew_method_pourover;
        } else if (_methodFilter.value === "brew_method_fullimmersion") {
          return cafe.brew_method_fullimmersion;
        } else if (_methodFilter.value === "brew_method_syphon") {
          return cafe.brew_method_syphon;
        }
      });
    }

    if (_search && _search.length > 0) {
      _cafes = _cafes.filter(function (cafe) {
        return cafe.name.toLowerCase().match(_search);
      });
    }

    return (
      <Container fluid>
        <Box className="landing-container">
          <Columns breakpoint="desktop">
            <Columns.Column>
              <form className='location-block'>
                <label className='location-label label'>
                  <span>Where</span>
                </label>
                <input className='location-input home-input' name="location-selector" disabled='true' value="Budapest, Hungary" onChange={this.setLocation} />
              </form>
            </Columns.Column>
            <Columns.Column>
              <div className='dropdown-block' onClick={this.toggleBeanDropdown}>
                <label className='dropdown-label label'>
                  <span>Bean</span>
                </label>
                <a className='button'>
                  <span>{this.state.beanFilter ? this.state.beanFilter.label : "Select a bean type"}</span>
                </a>
                <div className={"dropdown-container " + (this.state.beanDropdownOpen ? "is-open" : null)}>
                  <div className='dropdown'>
                    <button className='button label' data-arg1="all" data-arg2="All" onClick={this.setBeanType}>All</button>
                    <button className='button label' data-arg1="bean_roast_light" data-arg2="Light" onClick={this.setBeanType}>Light</button>
                    <button className='button label' data-arg1="bean_roast_medium" data-arg2="Medium" onClick={this.setBeanType}>Medium</button>
                    <button className='button label' data-arg1="bean_roast_dark" data-arg2="Dark" onClick={this.setBeanType}>Dark</button>
                  </div>
                </div>
              </div>
            </Columns.Column>
            <Columns.Column>
              <div className='dropdown-block' onClick={this.toggleMethodDropdown}>
                <label className='dropdown-label label'>
                  <span>Method</span>
                </label>
                <a className='button'>
                  <span>{this.state.methodFilter ? this.state.methodFilter.label : "Select your favorite method"}</span>
                </a>
                <div className={"dropdown-container " + (this.state.methodDropdownOpen ? "is-open" : null)}>
                  <div className='dropdown'>
                    <button className='button label' data-arg1="all" data-arg2="All" onClick={this.setMethodType}>All</button>
                    <button className='button label' data-arg1="brew_method_espresso" data-arg2="Espresso" onClick={this.setMethodType}>Espresso</button>
                    <button className='button label' data-arg1="brew_method_aeropress" data-arg2="Aeropress" onClick={this.setMethodType}>Aeropress</button>
                    <button className='button label' data-arg1="brew_method_pourover" data-arg2="Pour Over" onClick={this.setMethodType}>Pour Over</button>
                    <button className='button label' data-arg1="brew_method_syphon" data-arg2="Syphon" onClick={this.setMethodType}>Syphon</button>
                    <button className='button label' data-arg1="brew_method_full_immersion" data-arg2="Full Immersion" onClick={this.setMethodType}>Full Immersion</button>
                  </div>
                </div>
              </div>
            </Columns.Column>
          </Columns>
        </Box>

        <Box className="resultsContainer">
          <Columns breakpoint="desktop">
            {!this.state.isLoading && this.renderCafeList(_cafes)}
          </Columns>
        </Box>

        <div className="feedback">
          <p className="title">Want to stay up to date?</p>
          <Form>
            <FormGroup>
              <Input className="inputForm" type="email" name="email" id="exampleEmail" placeholder="Enter your email address here." value={this.state.email} onChange={this.handleEmailChange}/> <Button className="inputForm" outline color="primary" onClick={() => {this.subscribe()}}>Subscribe</Button>
            </FormGroup>
          </Form>
          <br />
          <p className="manifesto">You can read our manifesto <a href="/manifesto" alt="Manifesto">here</a>.</p>
        </div>
      </Container>
    );
  }
}