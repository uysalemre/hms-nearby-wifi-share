import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const shadow = {
    shadowColor: "black",
    shadowOffset: {
        width: 0,
        height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 17,
};

export const styles = StyleSheet.create({
    baseViewStyle: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#DEDEDE'
    },
    actionSelectionStyle: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 15,
        alignItems: 'center',
        marginTop: windowHeight / 4,
        marginBottom: windowHeight / 4,
        marginLeft: windowWidth / 16,
        marginRight: windowWidth / 16,
        ...shadow
    },
    operationSelectionStyle: {
        alignSelf: 'center',
        margin: 15,
        flexDirection: 'row'
    },
    textStyleHeader: {
        color: '#008AB3',
        fontWeight: 'bold',
        fontSize: 30,
        alignSelf: 'center',
    },
    imageViewStyle: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageStyle: {
        width: 200,
        height: 200,
        tintColor: 'black'
    },
    actionButtonStyle: {
        alignSelf: 'center',
        backgroundColor: "#008AB3",
        padding: 10,
        margin: 5,
        borderRadius: 15,
        ...shadow
    },
    textStyle: {
        color: 'white'
    }
});