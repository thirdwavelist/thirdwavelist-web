import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Col } from 'reactstrap';
import { Box, Container } from 'reactbulma';
import Select from 'react-select';
import Columns from 'react-bulma-components/lib/components/columns';
import { invokeApig } from "../libs/awsLib";
import config from "../config";
import "./Home.css";

/* global location */
/* eslint no-restricted-globals: ["off", "location"] */

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      cafes: [],
      roasters: [],
      filterText: "",
      methodFilter: null,
      roasterFilter: null,
      beanFilter: null,
      locationFilter: null,
      cities: []
    };

    this.filterList = this.filterList.bind(this);
    this.clear = this.clear.bind(this);
    this.getOrigin = this.getOrigin.bind(this);
    this.getRoastProfile = this.getRoastProfile.bind(this);
  }

  async componentDidMount() {
    try {
      const cafeCallResponse = await this.cafes();
      this.setState({ cafes: cafeCallResponse });
      const roasterCallResponse = await this.roasters();
      this.setState({ roasters: roasterCallResponse.map(obj => {
        var rObj = {};
        rObj['value'] = obj.name;
        rObj['label'] = obj.name + ' ' + obj.flag;
        return rObj;
      }) });

      const citiesResponse = [
        { value: 'budapest', label: 'Budapest, Hungary' }
      ];
      this.setState({ cities: citiesResponse });
    } catch (e) {
      console.log(e);
    }

    this.setState({ isLoading: false });
  }

  cafes() {
    return invokeApig({
      path: "/cafe",
      method: "GET",
      headers: { "x-api-key": config.apiGateway.API_KEY }
    });
  }

  roasters() {
    return invokeApig({
      path: "/roaster",
      method: "GET",
      headers: { "x-api-key": config.apiGateway.API_KEY }
    });
  }

  renderRoasterList(roasters) {
    if (roasters.length > 0) {
      return roasters.map((roaster) =>
        <button className='button label' data-arg1={roaster.name} data-arg2={roaster.name} onClick={this.setRoaster}>{roaster.name} {roaster.flag}</button>
      );
    }
  }

  renderCafeList(cafes) {
    if (cafes.length > 0) {
      return cafes.map((cafe) =>
        <Col lg="3" key={cafe.uid} className="resultsCard">
          <div className="imageCard">
            <img src={cafe.extra_thumbnail} alt="Thumbnail" />
            <span className="imageTitle">{cafe.name}</span>
            {/* <div className="after" onClick={() => {location.href=this.getLinkFrom(cafe)}}> */}
            <Link to={{
              pathname: '/' + cafe.city.toLowerCase() + '/' + cafe.name.replace(/\s+/g, '-').toLowerCase(),
              state: { cafeId: cafe.uid }
            }}
              className="after">
              <div className="center">
                <span className="floatLeft"><b>Roast profile: </b></span> <span className="floatRight">{this.getRoastProfile(cafe)}</span>
                <span className="floatLeft"><b>Roaster: </b></span> <span className="floatRight">{cafe.bean_roaster}</span>
                <span className="floatLeft"><b>Origin: </b></span> <span className="floatRight">{this.getOrigin(cafe)}</span>
                {this.getEspresso(cafe)}
                {this.getGrinder(cafe)}
                {this.getPourOver(cafe)}
                {this.getFullImmersion(cafe)}
              </div>
              {/* </div> */}
            </Link>
          </div>
        </Col>
      );
    } else {
      return <div className="noResultsText"><p className="header">No match found for the given criterias. </p><button onClick={this.clear}>Clear selection</button></div>
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
      roasterFilter: null,
      locationFilter: null
    })
  }

  filterList(event) {
    this.setState({ filterText: event.target.value });
  }
  setLocation(city) {
    console.log(city);
    if (city && city.value) {
      this.setState({
        locationFilter: { value: city.value, label: city.label },
      })
    } else if (city === null){
      this.setState({ locationFilter: null })
    }
  }
  setBeanType(bean) {
    if (bean && bean.value) {
      this.setState({
        beanFilter: { value: bean.value, label: bean.label },
      })
    } else if (bean === null){
      this.setState({ beanFilter: null })
    }
  }
  setMethodType(method) {
    if (method && method.value) {
      this.setState({
        methodFilter: { value: method.value, label: method.label },
      })
    } else if (method === null){
      this.setState({ methodFilter: null })
    }
  }
  setRoaster(roaster) {
    if (roaster && roaster.value) {
      this.setState({
        roasterFilter: { value: roaster.value, label: roaster.label },
      })
    } else if (roaster === null){
      this.setState({ roasterFilter: null })
    }
  }

  getRoastProfile(cafe) {
    var results = []
    if (cafe.bean_roast_light) results.push("Light")
    if (cafe.bean_roast_medium) results.push("Medium")
    if (cafe.bean_roast_dark) results.push("Dark")

    if (results.length <= 1) {
      return results.join();
    } else {
      return results.slice(0, -1).join(", ") + " and " + results[results.length - 1];
    }
  }

  getOrigin(cafe) {
    if (cafe.bean_origin_single && cafe.bean_origin_blend) return "Single & Blend"
    else if (cafe.bean_origin_single) return "Single"
    else if (cafe.bean_origin_blend) return "Blend"
    else return "Unknown"
  }

  render() {
    let _cafes = this.state.cafes;
    let _roasters = this.state.roasters;

    let _beanFilter = this.state.beanFilter;
    let _methodFilter = this.state.methodFilter;
    let _locationFilter = this.state.locationFilter;
    let _roasterFilter = this.state.roasterFilter;
    let _search = this.state.filterText.trim().toLowerCase();

    if (_locationFilter !== null && _locationFilter.value.length > 0) {
      // eslint-disable-next-line
      _cafes = _cafes.filter(function (cafe) {
        if (_locationFilter.value === "all") {
          return true || false
        } else {
          return cafe.city.toLowerCase().includes(_locationFilter.value.toLowerCase());
        }
      });
    }

    if (_roasterFilter !== null && _roasterFilter.value.length > 0) {
      // eslint-disable-next-line
      _cafes = _cafes.filter(function (cafe) {
        if (_roasterFilter.value === "all") {
          return true || false
        } else {
          return cafe.bean_roaster.toLowerCase().includes(_roasterFilter.value.toLowerCase());
        }
      });
    }

    if (_beanFilter !== null && _beanFilter.value.length > 0) {
      // eslint-disable-next-line
      _cafes = _cafes.filter(function (cafe) {
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
      _cafes = _cafes.filter(function (cafe) {
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
      <div>
        <Container fluid>
          <Box className="landing-container sticky">
            <Columns breakpoint="desktop">
              <Columns.Column>
                <div className='location-block'>
                  <span className='location-label label'>Where</span>
                  <div className='location-input'>
                    <Select
                      aria-label="Select a city"
                      options={this.state.cities}
                      placeholder='All cities'
                      name="location-selector"
                      isClearable={true}
                      value={this.state.locationFilter}
                      onChange={this.setLocation.bind(this)}
                    />
                  </div>
                </div>
              </Columns.Column>
              <Columns.Column>
                <div className='dropdown-block'>
                  <span className='dropdown-label label'>Bean</span>
                  <div className='dropdown-input'>
                    <Select
                      aria-label="Select a bean type"
                      options={[
                        { value: 'bean_roast_light', label: 'Light' },
                        { value: 'bean_roast_medium', label: 'Medium' },
                        { value: 'bean_roast_dark', label: 'Dark' }
                      ]}
                      placeholder='Select a bean type'
                      name="bean-selector"
                      isClearable={true}
                      value={this.state.beanFilter}
                      onChange={this.setBeanType.bind(this)}
                    />
                  </div>
                </div>
              </Columns.Column>
              <Columns.Column>
                <div className='dropdown-block'>
                  <span className='dropdown-label label'>Method</span>
                  <div className='dropdown-input'>
                    <Select
                      aria-label="Select a bean type"
                      options={[
                        { value: 'brew_method_espresso', label: 'Espresso' },
                        { value: 'brew_method_aeropress', label: 'Aeropress' },
                        { value: 'brew_method_pourover', label: 'Pour Over' },
                        { value: 'brew_method_syphon', label: 'Syphon' },
                        { value: 'brew_method_fullimmersion', label: 'Full Immersion' }
                      ]}
                      placeholder='Select a method type'
                      name="method-selector"
                      isClearable={true}
                      value={this.state.methodFilter}
                      onChange={this.setMethodType.bind(this)}
                    />
                  </div>
                </div>
              </Columns.Column>
              <Columns.Column>
                <div className='dropdown-block'>
                  <span className='dropdown-label label'>Roaster</span>
                  <div className='dropdown-input'>
                    <Select
                      aria-label="Select a bean type"
                      options={this.state.roasters}
                      placeholder='Select a roaster'
                      name="roaster-selector"
                      isSearchable={true}
                      isClearable={true}
                      value={this.state.roasterFilter}
                      onChange={this.setRoaster.bind(this)}
                    />
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
        </Container>
      </div>
    );
  }
}