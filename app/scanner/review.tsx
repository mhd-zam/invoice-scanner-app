import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { Typography } from '../../src/components/Typography';
import { useExpenseStore } from '../../src/features/expenses/store/useExpenseStore';
import { analyzeReceipt } from '../../src/features/scanner/services/ocrService';
import { radius, spacing, useAppTheme } from '../../src/theme';

export default function ReviewScreen() {
    const { uris } = useLocalSearchParams();
    const router = useRouter();
    const addExpense = useExpenseStore(s => s.addExpense);
    const { colors } = useAppTheme();

    const [images, setImages] = useState<string[]>([]);
    const [analyzing, setAnalyzing] = useState(true);
    const [merchant, setMerchant] = useState('');
    const [total, setTotal] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');
    const [currency, setCurrency] = useState('INR');
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        if (uris) {
            try {
                const parsedUris = JSON.parse(uris as string);
                setImages(parsedUris);

                // Analyze the first image for now
                if (parsedUris.length > 0) {
                    analyzeReceipt(parsedUris[0]).then(result => {
                        setMerchant(result.merchantName);
                        setTotal(result.totalAmount.toString());
                        setDate(result.date);
                        setCategory(result.category);
                        setCurrency(result.currency || 'INR');
                        setItems(result.items || []);
                        setAnalyzing(false);
                    });
                }
            } catch (e) {
                console.error("Failed to parse URIs", e);
                setAnalyzing(false);
            }
        }
    }, [uris]);

    const handleSave = () => {
        addExpense({
            merchantName: merchant,
            totalAmount: parseFloat(total) || 0,
            currency: currency,
            date: date || new Date().toISOString(),
            category: category || 'Uncategorized',
            items: items,
            imageUrls: images, // Use array
            status: 'verified',
        });
        // Navigate back to home/expenses
        router.dismissAll();
        router.replace('/(tabs)/expenses');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, backgroundColor: colors.background }}
        >
            <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    style={{ height: 300, backgroundColor: colors.muted }}
                >
                    {images.map((img, index) => (
                        <View key={index} style={styles.imagePage}>
                            <Image source={{ uri: img }} style={styles.image} resizeMode="contain" />
                            <View style={styles.pageIndicator}>
                                <Typography variant="label" color="white">{index + 1}/{images.length}</Typography>
                            </View>
                        </View>
                    ))}
                </ScrollView>

                <View style={[styles.form, { backgroundColor: colors.background, shadowColor: colors.shadow }]}>
                    <Typography variant="header3" style={{ marginBottom: spacing.m }}>
                        Review Receipt ({images.length} pages)
                    </Typography>

                    <Input
                        label="Merchant"
                        value={merchant}
                        onChangeText={setMerchant}
                        placeholder="Merchant Name"
                        editable={!analyzing}
                    />

                    <Input
                        label="Total Amount"
                        value={total}
                        onChangeText={setTotal}
                        keyboardType="decimal-pad"
                        placeholder="0.00"
                        editable={!analyzing}
                    />

                    <Input
                        label="Category"
                        value={category}
                        onChangeText={setCategory}
                        placeholder="Category (e.g. Food)"
                        editable={!analyzing}
                    />

                    <Input
                        label="Date"
                        value={date ? new Date(date).toLocaleDateString() : ''}
                        editable={false} // Simple text for now, should use DatePicker
                    />

                    <Button
                        title={analyzing ? "Analyzing..." : "Save Expense"}
                        onPress={handleSave}
                        loading={analyzing}
                        style={{ marginTop: spacing.l }}
                    />
                    <Button
                        title="Retake"
                        variant="ghost"
                        onPress={() => router.back()}
                        style={{ marginTop: spacing.s }}
                        disabled={analyzing}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    imagePage: {
        width: width,
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    pageIndicator: {
        position: 'absolute',
        bottom: spacing.m,
        right: spacing.m,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: spacing.s,
        paddingVertical: spacing.xs,
        borderRadius: radius.m,
    },
    form: {
        padding: spacing.l,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -24,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        flex: 1,
    },
});
