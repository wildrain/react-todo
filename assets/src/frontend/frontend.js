var React = require('react');

var ReactTodo = React.createClass({

	getInitialState: function(){
		return {text: '' , items:[]};
	},	

	render: function(){
		var item = function(todoItem , index){
			return <li key={index + todoItem}>
						{todoItem.text} <button type="button" onClick={this._handleButtonSubmit.bind(null,todoItem)}> showPanel </button>
						{todoItem.showPanel ? <p><input type="text" value="" onChange={this._handleChangeColor.bind(this, todoItem)} /></p> : null }
					</li>; 
		}.bind(this);

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

		this.state.items.push({
			'text' : this.state.text,
			'uid'  : new Date().getTime(),
			'showPanel': false,
			'color' : ''
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

		this.setState({items: this.state.items});
	},

	_handleChangeColor: function(e,todoItem){
		console.log(todoItem);
		console.log(e.target.value);
	}


});



React.render(<ReactTodo /> , document.getElementById('app'));





