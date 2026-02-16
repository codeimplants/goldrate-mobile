import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';

type MaintenanceModalProps = {
    open: boolean;
};

export default function MaintenanceModal({
    open,
}: MaintenanceModalProps) {
    return (
        <Modal
            visible={open}
            transparent={false}
            animationType="fade"
            statusBarTranslucent={true}
        >
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>We'll Be Back Soon</Text>
                    <Text style={styles.description}>
                        The app is currently under maintenance.
                        Please try again later.
                    </Text>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        maxWidth: 384,
        padding: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
    },
    description: {
        fontSize: 14,
        color: '#000',
        marginTop: 12,
        textAlign: 'center',
    },
});