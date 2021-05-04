import React from 'react';
import { useAsync, useAsyncCallback } from 'react-async-hook';
import { View } from 'react-native';
import { Button, Dialog, Paragraph, Portal } from 'react-native-paper';
import {
    BarCodeScannedCallback,
    BarCodeScannerResult,
    BarCodeScanner,
} from 'expo-barcode-scanner';

import Loading from './Loading';
import Styles from './styles';

// Display a QR scanner that transitions to content with an alert on error
export default <T extends unknown>({ parse, render }: Props<T>) => {
    const [error, setError] = React.useState<string>();
    const dismiss = () => setError(undefined);

    // Execute the parsing logic for the QR data
    // and initialize the contents with the result
    const contents = useAsyncCallback(render);
    const callback: BarCodeScannedCallback = result => {
        try {
            contents.execute(parse(result));
        } catch (err) {
            setError(err.message);
            contents.reset();
        }
    };

    // Show the scanner (or error)
    const scanner = useAsync(async () => {
        // NOTE: Handling of permission-denied omitted for brevity
        await BarCodeScanner.requestPermissionsAsync();
        return (
            <View style={Styles.fill}>
                <BarCodeScanner
                    style={Styles.fill}
                    barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                    onBarCodeScanned={error ? undefined : callback}
                />
                <Portal>
                    <Dialog visible={!!error} onDismiss={dismiss}>
                        <Dialog.Content>
                            <Paragraph>{error}</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={dismiss}>Ok</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        );
    }, []);

    // Display the contents or the scanner accordingly
    return <Loading>{contents.currentPromise ? contents : scanner}</Loading>;
};

export type Props<T> = {
    parse: (result: BarCodeScannerResult) => T;
    render: (data: T) => Promise<JSX.Element | null>;
};
