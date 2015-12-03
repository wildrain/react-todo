var jquery = require('jquery'),
	React = require('react'),
	_lo   = require('lodash');

require('jquery-ui');	

var ReactTodo = React.createClass({

	getInitialState: function(){
		return {text: '' , items:[], color: ''};
	},

	componentWillMount : function(){		
		if(JSON.parse(localStorage.getItem('todoLists')) != null ){
			this.state.items = JSON.parse(localStorage.getItem('todoLists'));
		}
	},

	componentDidMount : function(){
		var self = this;
		jquery('#sortable').sortable({
			stop: self._handleSortingUpdate
		});		
	},

	render: function(){
		var self = this;
		var item = function(todoItem , index){
			var style = {
				color : todoItem.color
			};	

			return  (
					!todoItem.isDeleted ? 
						<li className="sort" style={style} data-uid = {todoItem.uid} key={todoItem.uid}>
							{todoItem.text}
							<button type="button" onClick={self._handleButtonSubmit.bind(this,todoItem)}> changeColor </button>
							<button type="button" onClick={self._handleEditButton.bind(this,todoItem)}> editTodo </button>
							<button type="button" onClick={self._handleMoveToTrash.bind(this,todoItem)}> Move to trash </button>
							{todoItem.showPanel ? <p><input type="text" value={todoItem.color} id={todoItem.uid} onChange={self._handleChangeColor} /></p> : null }
							{todoItem.editPanel ? <p><input type="text" value={todoItem.text} id={todoItem.uid} onChange={self._handleEditTodo} /></p> : null }
						</li>
					: 
					null
					);				 
		};


		var deleteItem = function(todoItem , index){
			var style = {
				color : todoItem.color
			};	

			return  (
					todoItem.isDeleted ? 
						<li className="sort" style={style} data-uid = {todoItem.uid} key={todoItem.uid}>
							{todoItem.text}
							<button type="button" onClick={self._handleButtonSubmit.bind(this,todoItem)}> changeColor </button>
							<button type="button" onClick={self._handleEditButton.bind(this,todoItem)}> editTodo </button>
							<button type="button" onClick={self._handleRestoreItem.bind(this,todoItem)}> Restore Todo </button>
							<button type="button" onClick={self._handleDeleteItem.bind(this,todoItem)}> deleteTodo </button>
							{todoItem.showPanel ? <p><input type="text" value={todoItem.color} id={todoItem.uid} onChange={self._handleChangeColor} /></p> : null }
							{todoItem.editPanel ? <p><input type="text" value={todoItem.text} id={todoItem.uid} onChange={self._handleEditTodo} /></p> : null }
						</li>
					: 
					null
					);				 
		};

		return (
			<div>
				<div className = "todo-rapper">
					<h1 className="heading">React Todo App</h1>					
					<form onSubmit = {this._handleSubmit}>
						<input onChange = {this._handleOnChange} value= {this.state.text} />
						<button>add {this.state.items.length + 1}</button>
					</form>

					{(this.state.items.length ? 
						<ul id="sortable">
							{this.state.items.map(item)}
						</ul> 
						: 
						<p> no item found </p>
					)}

					<h1 className="heading">Trashed Items</h1>	
					{(this.state.items.length ? 
						<ul id="sortable">
							{this.state.items.map(deleteItem)}
						</ul> 
						: 
						<p> no item found </p>
					)}

				</div>

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
			'editPanel': false,
			'isDeleted' : false,
		});
		this.setState({text: ''});
		this._handleSavingData(allItems);

		e.preventDefault();
	},

	_handleButtonSubmit: function(todoItem){		
		this.state.items.forEach(function(item){
			if(item.uid === todoItem.uid){
				item.showPanel = !item.showPanel;	
				item.editPanel = false;			
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

	_handleEditButton: function(todoItem){		
		this.state.items.forEach(function(item){
			if(item.uid === todoItem.uid){
				item.showPanel = false;
				item.editPanel = !item.editPanel;
			}	
		});		
		this._handleSavingData(this.state.items);
	},

	_handleEditTodo: function(e){
		var uid   = e.target.id,
			value = e.target.value;			
		this.state.items.forEach(function(item){
			if(item.uid == uid){
				item.text = value;			
			}	
		});
		this._handleSavingData(this.state.items);
	},

	_handleMoveToTrash: function(todoItem){	
		this.state.items.forEach(function(item){
			if(item.uid == todoItem.uid){
				item.isDeleted = true;			
			}	
		});
		this._handleSavingData(this.state.items);
	},

	_handleRestoreItem: function(todoItem){	
		this.state.items.forEach(function(item){
			if(item.uid == todoItem.uid){
				item.isDeleted = false;			
			}	
		});
		this._handleSavingData(this.state.items);
	},

	_handleDeleteItem: function(todoItem){
		console.log(todoItem);
		var index = -1;
		for(var i=0; i<this.state.items.length; i++){
			if(this.state.items[i].uid == todoItem.uid){
				index = i; 
				break;
			}
		}
		this.state.items.splice(index, 1);
		this._handleSavingData(this.state.items);
	},

	_handleSortingUpdate: function(event, ui){
		var updateItems = [],
		    itemIds = [],
		    self = this;
		jquery( 'ul#sortable' ).find( 'li.sort' ).each( function(index, item) {
			itemIds.push(jquery(item).data('uid'));
		});
		itemIds.forEach(function(itemId){					
			var index = _lo.findIndex(self.state.items, {uid : itemId});
			updateItems.push(self.state.items[index]);
		})
		localStorage.setItem('todoLists' , JSON.stringify(updateItems));				
	},

	_handleSavingData: function(items){
		localStorage.setItem('todoLists' , JSON.stringify(items));
		this.setState({items: items});
	}

});

React.render(<ReactTodo /> , document.getElementById('app'));





