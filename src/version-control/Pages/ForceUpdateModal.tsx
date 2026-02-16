import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type ForceUpdateModalProps = {
    open: boolean;
    onUpdate: () => void;
};

export default function ForceUpdateModal({
    open,
    onUpdate,
}: ForceUpdateModalProps) {
    return (
        <Modal
            visible={open}
            transparent={false}
            animationType="fade"
            statusBarTranslucent={true}
        >
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>Update Required</Text>
                    <Text style={styles.description}>
                        Your app version is no longer supported.
                        Please update to continue using the app.
                    </Text>

                    <TouchableOpacity
                        onPress={onUpdate}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Update Now</Text>
                    </TouchableOpacity>
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
        color: '#DC2626',
        textAlign: 'center',
    },
    description: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 12,
        textAlign: 'center',
    },
    button: {
        marginTop: 24,
        width: '100%',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        backgroundColor: '#DC2626',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});