import React from 'react';
import { Text, View, FlatList } from 'react-native';
import { BACKEND_IP } from '../../../config';
import ChangeView from './changeView';

export default class ChangesQueue extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            changesLoaded: false
        }
    }

    async componentDidMount() {
        const token = this.props.token;
        this.fetchToAPI( BACKEND_IP + '/central/changes', {
            method: 'GET',
            headers: {
                Accept           : 'application/json',
                'Content-Type'   : 'application/json',
                'x-access-token' : token
            }
        })
        .then( response => response.json() )
        .then( responseJson => {
            if ( ! responseJson.err ) {
                this.setState({
                    changesLoaded: true,
                    changes: responseJson.result
                });
            } else {
                this.setState({
                    changesLoaded: true,
                    changes: []
                });
            }
        })
        .catch( err => {
            this.setState({
                changesLoaded: true,
                changes: []
            });
        });
    }

    fetchToAPI(ipString, options) {
        return fetch(ipString, options);
    }

    keyExtractor(item) {
        return `${item._id}`;
    }

    render() {
        if ( ! this.state.changesLoaded ) {
            return <Text>Cargando cambios...</Text>
        } else if ( this.state.changes.length === 0 ) {
            return null
        } else {
            return (
                <View style={{width: 420, justifyContent: 'center', alignItems: 'center'}}>
                    <FlatList 
                        data={this.state.changes}
                        style={{width: 420}}
                        renderItem={({item}) => 
                            (<View style={{height: 400, alignItems:"center"}}>
                                <ChangeView change={item}/>
                            </View>)
                        } 
                        keyExtractor={this.keyExtractor}
                        />
                </View>
            );
        } 
    }
}