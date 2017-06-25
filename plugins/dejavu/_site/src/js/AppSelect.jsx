//This contains the extra features like
//Import data, Export Data, Add document, Pretty Json
var React = require('react');

var AppSelect = React.createClass({
    getInitialState: function() {
        return {
            selectVal: null,
            apps: null,
            searchValue: '',
            setAppClass: 'hide',
            touched: false
        };
    },
    componentDidUpdate: function() {
        if(!this.props.splash && config.appname && this.state.searchValue === '' && !this.state.touched) {
            this.setState({
                searchValue: config.appname,
                touched: true
            });
        }  
    },
    handleInput: function(event) {
        this.setState({
            searchValue: event.target.value
        });
        if(this.props.appnameCb) {
            this.props.appnameCb(event.target.value);
        }
    },
    focusInput: function() {
        if(this.props.apps.length && !this.props.connect) {
            this.setState({
                setAppClass: 'show'
            });
        }
    },
    blurInput: function() {
        setTimeout(function() {
            this.setState({
                setAppClass: 'hide'
            });
        }.bind(this), 300);
    },
    selectOption: function(appname) {
        this.setState({
            searchValue: appname
        });
        var app_config = this.props.apps.filter(function(app, index) {
            if(app.appname === appname) {
                return {
                    appname: app.appname,
                    url: app.url
                };
            }
        });
        if(app_config.length && app_config[0].url) {
            this.props.setConfig(app_config[0].url);
        }
    },
    render: function() {
        var opts = {};
        var optionsArr = [];
        if(this.props.connect) {
            opts['readOnly'] = 'readOnly';
        }
        if(this.props.apps && this.props.apps.length) {
            optionsArr = this.props.apps.filter(function(app, index) {
               return this.state.searchValue === '' || (this.state.searchValue !== '' && app.appname.toUpperCase().indexOf(this.state.searchValue.toUpperCase()) !== -1)
            }.bind(this));
        }

        var options = optionsArr.map(function(app, index) {
            return opt = <li key={index} onClick={this.selectOption.bind(this, app.appname)}>{app.appname}</li>;
        }.bind(this));

        var searchValue = this.state.searchValue;
        var setAppClass = options.length == 0 ? 'hide' : 'autolist setApp col-xs-12 '+this.state.setAppClass;
        return (<div className="autocomplete">
                    <input className="search form-control"
                        type="text"
                        value={searchValue}
                        name="appname"
                        placeholder="Appname (aka index) goes here"
                        onChange={this.handleInput}
                        onFocus={this.focusInput} onBlur={this.blurInput} {...opts}/>
                    <ul id="setApp" className={setAppClass} name="apps">
                        {options}
                    </ul>
                </div>
                );
    }
});

module.exports = AppSelect;
