import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type SoftUpdateModalProps = {
    open: boolean;
    onUpdate: () => void;
    onSkip: () => void;
};

export default function SoftUpdateModal({
    open,
    onUpdate,
    onSkip,
}: SoftUpdateModalProps) {
    return (
        <Modal
            visible={open}
            transparent={true}
            animationType="slide"
            onRequestClose={onSkip}
            statusBarTranslucent={true}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Update Available</Text>
                    <Text style={styles.description}>
                        A new version of the app is available. Update now for the best experience.
                    </Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={onSkip}
                            style={[styles.button, styles.skipButton]}
                        >
                            <Text style={styles.skipButtonText}>Later</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onUpdate}
                            style={[styles.button, styles.updateButton]}
                        >
                            <Text style={styles.updateButtonText}>Update</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: 'white',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 24,
        maxWidth: 448,
        width: '100%',
        alignSelf: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
    },
    description: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
    },
    skipButton: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: 'white',
    },
    skipButtonText: {
        color: '#374151',
        fontWeight: '500',
    },
    updateButton: {
        backgroundColor: '#2563EB',
    },
    updateButtonText: {
        color: 'white',
        fontWeight: '500',
    },
});