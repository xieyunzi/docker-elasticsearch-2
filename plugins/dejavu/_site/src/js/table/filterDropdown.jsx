var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var SingleMenuItem = require('./SingleMenuItem.jsx');


//Filter dropdown for each column header
var FilterDropdown = React.createClass({
    getInitialState: function() {
        return {
            filterField: null,
            filterValue: null
        };
    },
    changeFilter: function(field, value) {
        this.setState({
            filterField: field,
            filterValue: value
        });
    },
    boolFilter: function(value) {
        this.setState({
            filterField: 'term',
            filterValue: value
        });
    },
    getFilterVal: function(val) {
        this.setState({
            filterValue: val
        });
    },
    applyFilter: function() {
        if (this.state.filterField != null && this.state.filterValue != null && this.state.filterValue != '')
            this.props.filterInfo.applyFilter(this.props.type, this.props.columnField, this.state.filterField, this.state.filterValue, this.props.analyzed);
    },
    render: function() {
        var ButtonToolbar = ReactBootstrap.ButtonToolbar;
        var DropdownButton = ReactBootstrap.DropdownButton;
        var MenuItem = ReactBootstrap.MenuItem;
        var Dropdown = ReactBootstrap.Dropdown;
        var datatype = this.props.datatype;
        var applyBtn = this.state.filterValue == '' ? 'true' : 'false';
        var self = this;
        
        function createDropItem(method, availableValues) {
            function filterRender(value) {
                var currentItem;
                switch(method) {
                    case 'boolean':
                        currentItem = (<SingleMenuItem boolFilter={self.boolFilter}  columnField={self.props.columnField} filterField={self.state.filterField} changeFilter={self.changeFilter} datatype={self.props.datatype} getFilterVal={self.getFilterVal} val={value} />);
                    break;
                    case 'date':
                        currentItem = (<SingleMenuItem  columnField={self.props.columnField} filterField={self.state.filterField} changeFilter={self.changeFilter} datatype={datatype} getFilterVal={self.getFilterVal} val={value} />);
                    break;
                    case 'string':
                        currentItem = (<SingleMenuItem columnField={self.props.columnField} filterField={self.state.filterField} changeFilter={self.changeFilter} getFilterVal={self.getFilterVal} val={value} />);
                    break;
                    case 'number':
                        currentItem = (<SingleMenuItem  columnField={self.props.columnField} filterField={self.state.filterField} changeFilter={self.changeFilter} getFilterVal={self.getFilterVal} val={value} />);
                    break;
                }
                return currentItem;
            };
            var newAvailableValues = availableValues.map(function(value) {
                return filterRender(value);
            });
            if(newAvailableValues.length) {
                return (<Dropdown.Menu className="menuItems pull-right">
                            {newAvailableValues}
                            <div className="singleItem">
                                <button className='btn btn-info col-xs-12' onClick={self.applyFilter}>Apply</button>
                            </div>
                        </Dropdown.Menu>);
            } else {
                return null;
            }
        }

        var stringFilter = createDropItem('string', ['search', 'has', 'has not']);
        var numberFilter = createDropItem('number', ['greater than', 'less than']);
        var dateFilter = createDropItem('date', ['greater than', 'less than', 'range']);
        var booleanFilter = createDropItem('boolean', ['true', 'false']);

        var FilterMenuItems = '';

        switch (datatype) {
            case 'string':
            case 'text':
            case 'keyword':
                FilterMenuItems = stringFilter;
                break;
            case 'long':
            case 'integer':
            case 'short':
            case 'byte':
            case 'double':
            case 'float':
                FilterMenuItems = numberFilter;
                break;
            case 'date':
                FilterMenuItems = dateFilter;
                break;
            case 'boolean': 
                FilterMenuItems = booleanFilter;
            break;    
            default:
                datatype = null;
                break;
        }

        if (datatype == null) {
            return (<span></span>);
        } else {
            return (<div className="filterDropdown">
                    <ButtonToolbar>
                        <Dropdown id="ab" className="filterDropdownContainer">
                          <Dropdown.Toggle className="filterBtn">
                            <i className="fa fa-filter"></i>
                          </Dropdown.Toggle>
                            {FilterMenuItems}
                        </Dropdown>
                    </ButtonToolbar>
                </div>);
        }
    }
});

module.exports = FilterDropdown;
