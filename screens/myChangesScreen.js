import React from 'react';
import { View, StyleSheet } from 'react-native';
import PurposalsQueue       from '../components/myChangesComponents/purposalsQueue';
import layoutStyle          from '../styles/layoutStyle';
import AreYouSureModal      from '../components/homeComponents/areYouSureModal';
import ConfirmModal         from '../components/homeComponents/confirmModal';
import DateUtils            from '../components/dateUtils';
const  dateUtils = new DateUtils();

export default class MyChangesScreen extends React.Component {
    constructor(props) {
        super(props);
        this.socket = this.props.navigation.getParam("socket");
        this.name   = this.props.navigation.getParam("name");
        this.bindMethods();
        this.state = {
            isModalVisible   : false,
            modalMessage     : "",
            modalChange      : undefined,
            modalPurposal    : undefined,
            isConfirmVisible : false,
            confirmMessage   : ""
        }
    }

    bindMethods() {
        this.purposalPressed  = this.purposalPressed.bind(this);
        this.showModal        = this.showModal.bind(this); 
        this.confirmPurposal  = this.confirmPurposal.bind(this); 
        this.showConfirmation = this.showConfirmation.bind(this); 
        this.hideConfirmation = this.hideConfirmation.bind(this);
        this.hideModal        = this.hideModal.bind(this);
    }

    purposalPressed(change, purposal) {
        this.showModal(change, purposal);
    }

    showModal(change, purposal) {
        const message = 
            `${this.name}, ¿quieres trabajar ` +
            `el ${purposal.day} ${dateUtils.getTurnString(purposal.turn)} ` +
            `a cambio de que ${purposal.owner} trabaje el ` +
            `${change.day} ${dateUtils.getTurnString(change.turn)}?`;

        this.setState({
            isModalVisible : true,
            modalMessage   : message,
            modalChange    : change,
            modalPurposal  : purposal
        });
    }

    hideModal() {
        this.setState({
            isModalVisible: false,
            modalMessage: "",
            modalChange: undefined,
            modalPurposal: undefined
        });
    }

    confirmPurposal() {
        this.hideModal();
        this.showConfirmation("Cambio realizado");
        this.socket.emit(
            "acceptPurposal",
            this.state.modalChange, 
            this.state.modalPurposal );
    }

    showConfirmation(message) {
        this.setState({
            isConfirmVisible : true,
            confirmMessage   : message
        });
    }

    hideConfirmation() {
        this.props.navigation.navigate("HomeScreen", {
            token: this.props.navigation.getParam("token")
        });
    }

    render() {
        return(
            <View style={styles.container}>
                <PurposalsQueue 
                    changes={this.props.navigation.getParam("changes")}
                    onPressFn={this.purposalPressed}
                    name={this.props.navigation.getParam("name")}
                    />
                <AreYouSureModal
                    visible    = { this.state.isModalVisible }
                    change     = { this.state.modalChange    }
                    text       = { this.state.modalMessage   }
                    closeModal = { this.hideModal            }
                    onPressFn  = { this.confirmPurposal      } />
                <ConfirmModal
                    visible    = { this.state.isConfirmVisible }
                    closeModal = { this.hideConfirmation       }
                    text       = { this.state.confirmMessage   } />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection:'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#bee6ef',
        paddingTop:layoutStyle.verticalUnits10*2
    },
});