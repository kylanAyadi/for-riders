import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import data from './components.json';


const showparams = params => (
    params.map((element, i) => {
        return <Text key={i}>Params: {element.name}</Text>
    })
)

const showmethod = methods => (
    //console.log("SHOXWW",methods)

    methods.map((element, i) => {

        return (
            <View style={{ marginBottom: 3 }} key={i} >
                <Text style={{ fontWeight: 'bold' }} >method : {element.name}</Text>
                <Text>{element.docblock}</Text>
                {element.params[0] ? showparams(element.params) : <Text>No params{"\n"}</Text>}
                <Text>return: {element.returns}{"\n"}</Text>
            </View>
        )
    })


)

const Doc = props => (
    
    <View style={styles.container}>
        <View>
            <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 14 }}>Component: {props.mydoc.displayName}{"\n"}</Text>
            <Text>Route : {props.mydoc.filename}{"\n"}</Text>
            <Text>{props.mydoc.description}{"\n"}</Text>
        </View>
        {props.mydoc.methods[0] ? showmethod(props.mydoc.methods) : <Text>No methods</Text>}
    </View>
)


export default class Documentation extends React.Component {

    showdocs() {
        return data.map(function (elem, i) {

            // console.log(elem.description);
            /*console.log(data.displayName);
            console.log(data.methods);
            console.log(data.filename); */
            // console.log(elem);

            return <Doc mydoc={elem} key={i} />


        })
    }



    render() {
        return (
            <ScrollView style={{ flex: 1, }}>
                <View style={{ flex: 1, }}>
                    {this.showdocs()}
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: '2%',
        height: 1000
        
    }
})