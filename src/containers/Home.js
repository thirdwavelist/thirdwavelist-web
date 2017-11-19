import React, { Component } from "react";
import { Card, CardTitle, CardText, CardImg, Col } from "reactstrap";
import { Box, Content, Container } from 'reactbulma'
import Columns from 'react-bulma-components/lib/components/columns';
import { invokeApig } from "../libs/awsLib";
import "./Home.css";

export default class Home extends Component {
  constructor(props) {  
    super(props);
    
    this.state = {
      isLoading: true,
      cafes: [],
      filterText: "",
      methodFilter: null,
      beanFilter: null,
      beanDropdownOpen: false,
      methodDropdownOpen: false
    };
    
    this.toggleBeanDropdown = this.toggleBeanDropdown.bind(this);
    this.toggleMethodDropdown = this.toggleMethodDropdown.bind(this);
    this.filterList = this.filterList.bind(this);
    this.setBeanType = this.setBeanType.bind(this);
    this.setMethodType = this.setMethodType.bind(this);
    this.setLocation = this.setLocation.bind(this);
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
    
  cafes() {
    return invokeApig({ path: "/cafe", method: "GET" });
  }
  
  renderCafeList(cafes) {
    return cafes.map((cafe) =>
      <Col sm="4" key={cafe.id}>
        <div>
          <Card body>
            <CardImg src={cafe.thumbnail}/>
            <CardTitle>{cafe.name}</CardTitle>
              <CardText>{cafe.address}</CardText>
          </Card>
        </div>
      </Col>
    );
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
  
  toggleBeanDropdown() {
    this.setState({
      beanDropdownOpen: !this.state.beanDropdownOpen
    });
  }
  toggleMethodDropdown() {
    this.setState({
      methodDropdownOpen: !this.state.methodDropdownOpen
    });
  }
  
  render() {
    let _cafes = this.state.cafes;
    
    let _beanFilter = this.state.beanFilter;
    let _methodFilter = this.state.methodFilter;
    let _search = this.state.filterText.trim().toLowerCase();

    if (_beanFilter != null && _beanFilter.value.length > 0) {
      _cafes = _cafes.filter(function(cafe) {
        if (_beanFilter.value === "bean_roast_light") {
          return cafe.bean_light; 
        } else if (_beanFilter.value === "bean_roast_dark") {
          return cafe.bean_dark;
        }
      });
    }
    
    if (_methodFilter != null && _methodFilter.value.length > 0) {
      _cafes = _cafes.filter(function(cafe) {
        if (_methodFilter.value === "brew_method_espresso") {
          return cafe.method_espresso; 
        } else if (_methodFilter.value === "brew_method_aeropress") {
          return cafe.method_aeropress;
        } else if (_methodFilter.value === "brew_method_pour_over") {
          return cafe.method_pour_over;
        } else if (_methodFilter.value === "brew_method_fullimmersion") {
          return cafe.method_full_immersion;
        } else if (_methodFilter.value === "brew_method_syphon") {
          return cafe.method_syphon;
        } 
      });
    }

    if (_search && _search.length > 0) {
      _cafes = _cafes.filter(function(cafe) {
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
                  <span>{this.state.beanFilter ? this.state.beanFilter.label : "Select a bean type" }</span>
                </a>
                <div className={"dropdown-container " + (this.state.beanDropdownOpen ? "is-open" : null)}>
                  <div className='dropdown'>
                    <button className='button label' data-arg1="bean_light" data-arg2="Light" onClick={this.setBeanType}>Light</button>
                    <br />
                    <button className='button label' data-arg1="bean_dark"  data-arg2="Dark" onClick={this.setBeanType}>Dark</button>
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
                  <span>{this.state.methodFilter ? this.state.methodFilter.label : "Select your favorite method" }</span>
                </a>
                <div className={"dropdown-container " + (this.state.methodDropdownOpen ? "is-open" : null)}>
                  <div className='dropdown'>
                    <button className='button label' data-arg1="method_espresso" data-arg2="Espresso" onClick={this.setMethodType}>Espresso</button>
                    <br />
                    <button className='button label' data-arg1="method_aeropress"  data-arg2="Aeropress" onClick={this.setMethodType}>Aeropress</button>
                    <br />
                    <button className='button label' data-arg1="method_pour_over" data-arg2="Pour Over" onClick={this.setMethodType}>Pour Over</button>
                    <br />
                    <button className='button label' data-arg1="method_syphon"  data-arg2="Syphon" onClick={this.setMethodType}>Syphon</button>
                    <br />
                    <button className='button label' data-arg1="method_full_immersion" data-arg2="Full Immersion" onClick={this.setMethodType}>Full Immersion</button>
                  </div>
                </div>
              </div>
            </Columns.Column>
          </Columns>
        </Box>
        <Columns breakpoint="mobile">
          {!this.state.isLoading && this.renderCafeList(_cafes)}
        </Columns>
      </Container>
    );
  }
}