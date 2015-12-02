var React = require('react');

var ReactTodo = React.createClass({

	getInitialState: function(){
		return {text: '' , items:[], color: ''};
	},

	componentWillMount : function(){		
		if(JSON.parse(localStorage.getItem('todoLists')) != null ){
			this.state.items = JSON.parse(localStorage.getItem('todoLists'));
		}
	},

	render: function(){
		var self = this;
		var item = function(todoItem , index){
			var style = {
				color : todoItem.color
			};			
			return <li style={style} key={index + todoItem}>
						{todoItem.text}<button type="button" onClick={self._handleButtonSubmit.bind(this,todoItem)}> showPanel </button>
						{todoItem.showPanel ? <p><input type="text" id={todoItem.uid} onChange={self._handleChangeColor} /></p> : null }
					</li>; 
		};

		return (
			<div>
				<h3 className="heading">ReactTodo App</h3>
				{(this.state.items.length ? 
					<ul>
						{this.state.items.map(item)}
					</ul> 
					: 
					<p> no item found </p>
				)} 
				<form onSubmit = {this._handleSubmit}>
					<input onChange = {this._handleOnChange} value= {this.state.text} />
					<button>add {this.state.items.length + 1}</button>
				</form>
			</div>
		);
	},


	_handleOnChange: function(e){
		this.setState({text: e.target.value});
	},

	_handleSubmit: function(e){
		var allItems = this.state.items;
		if(allItems == undefined && allItems.length < 1){
			allItems = [];
		}
		allItems.push({
			'text' : this.state.text,
			'uid'  : new Date().getTime(),
			'showPanel': false,
		});
		this.setState({text: ''});

		e.preventDefault();
	},

	_handleButtonSubmit: function(todoItem){		
		this.state.items.forEach(function(item){
			if(item.uid === todoItem.uid){
				item.showPanel = !item.showPanel;				
			}	
		});		
		this._handleSavingData(this.state.items);
	},

	_handleChangeColor: function(e){
		var uid   = e.target.id,
			value = e.target.value;			
		this.state.items.forEach(function(item){
			if(item.uid == uid){
				item.color = value;			
			}	
		});
		this._handleSavingData(this.state.items);
	},

	_handleSavingData: function(items){
		localStorage.setItem('todoLists' , JSON.stringify(items));
		this.setState({items: items});
	}

});



React.render(<ReactTodo /> , document.getElementById('app'));





