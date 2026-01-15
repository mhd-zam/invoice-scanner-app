import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Camera, X, Zap, ZapOff } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button } from '../../src/components/Button';
import { Typography } from '../../src/components/Typography';
import { spacing, useAppTheme } from '../../src/theme';

export default function ScannerScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [flash, setFlash] = useState<'off' | 'on'>('off');
    const [capturedImages, setCapturedImages] = useState<string[]>([]); // Track captured images
    const cameraRef = useRef<CameraView>(null);
    const router = useRouter();
    const { colors } = useAppTheme(); // Hook usage

    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: spacing.l }]}>
                <View style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: colors.primary + '15',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: spacing.l
                }}>
                    <Camera size={48} color={colors.primary} />
                </View>

                <Typography variant="header2" style={{ textAlign: 'center', marginBottom: spacing.s }}>
                    Camera Access Needed
                </Typography>

                <Typography variant="body" color={colors.textSecondary} style={{ textAlign: 'center', marginBottom: spacing.xxl, maxWidth: '80%' }}>
                    To scan and process your invoices directly, please allow camera access.
                </Typography>

                <Button
                    onPress={requestPermission}
                    title="Allow Camera Access"
                    style={{ width: '100%', marginBottom: spacing.s }}
                />

                <Button
                    onPress={() => router.back()}
                    title="Not Now"
                    variant="ghost"
                    style={{ width: '100%' }}
                />
            </View>
        );
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.8,
                    base64: true,
                    skipProcessing: true,
                });

                if (photo && isMounted.current) {
                    setCapturedImages(prev => [...prev, photo.uri]); // Add to array
                }
            } catch (error) {
                console.error("Failed to take picture", error);
            }
        }
    };

    const handleDone = () => {
        if (capturedImages.length > 0) {
            router.push({
                pathname: '/scanner/review',
                params: { uris: JSON.stringify(capturedImages) } // Pass array as string
            });
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFill}
                facing="back"
                ref={cameraRef}
                flash={flash}
            />
            <View style={styles.overlay}>
                {/* Header Controls */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                        <X color="white" size={24} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setFlash(f => f === 'off' ? 'on' : 'off')}
                        style={styles.iconButton}
                    >
                        {flash === 'on' ? <Zap color="#FFD700" size={24} /> : <ZapOff color="white" size={24} />}
                    </TouchableOpacity>
                </View>

                {/* Guidelines */}
                <View style={styles.guidelinesContainer}>
                    <View style={[styles.cornersTopLeft, { borderColor: colors.primary }]} />
                    <View style={[styles.cornersTopRight, { borderColor: colors.primary }]} />
                    <View style={[styles.cornersBottomLeft, { borderColor: colors.primary }]} />
                    <View style={[styles.cornersBottomRight, { borderColor: colors.primary }]} />
                </View>

                {/* Capture Button and Controls */}
                <View style={styles.footer}>
                    <View style={{ flex: 1, alignItems: 'flex-start' }}>
                        {/* Placeholder for left side if needed */}
                    </View>

                    <TouchableOpacity onPress={takePicture} style={styles.captureBtnInner}>
                        <View style={styles.captureBtnOuter} />
                    </TouchableOpacity>

                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        {capturedImages.length > 0 && (
                            <View style={styles.doneContainer}>
                                <View style={styles.badge}>
                                    <Typography variant="label" color="white">{capturedImages.length}</Typography>
                                </View>
                                <Button
                                    title="Done"
                                    onPress={handleDone}
                                    size="small"
                                    style={{ minWidth: 80 }}
                                />
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black', // Camera screen is always dark base
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        justifyContent: 'space-between',
        padding: spacing.l,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.xl,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    guidelinesContainer: {
        flex: 1,
        marginVertical: spacing.xl,
        position: 'relative',
        marginHorizontal: spacing.l,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        borderRadius: 12,
        borderStyle: 'dashed',
    },
    cornersTopLeft: { position: 'absolute', top: -2, left: -2, width: 30, height: 30, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 12 },
    cornersTopRight: { position: 'absolute', top: -2, right: -2, width: 30, height: 30, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 12 },
    cornersBottomLeft: { position: 'absolute', bottom: -2, left: -2, width: 30, height: 30, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 12 },
    cornersBottomRight: { position: 'absolute', bottom: -2, right: -2, width: 30, height: 30, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 12 },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.xl,
        paddingHorizontal: spacing.l,
    },
    doneContainer: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -10,
        right: -5,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    captureBtnInner: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureBtnOuter: {
        width: 72,
        height: 72,
        borderRadius: 36,
        borderWidth: 2,
        borderColor: 'black',
        backgroundColor: 'white',
    },
});
