import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, StyleSheet, Linking, Image, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Colors, Images, Styles } from '../theme/Index';

export default function NotificationManagementScreen({ navigation }) {


  return (
    <View style={styles.pageContainer}>
      <View style={styles.notificationContainer}>
        <View style={styles.copyContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerLabel}>How Do I Turn Them On/Off Later?</Text>
          </View>
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsCopy}>
              Under the general settings section of your device go to the settings screen of this app.  There you will
              find an on/off option for Notifications.
            </Text>
            {Platform.OS == 'ios' && (
              <>
                <Text style={[styles.instructionsLabel, { marginTop: 30 }]}>iOS</Text>
                <Text style={styles.instructionsCopy}>Settings > Notifications > App Name</Text>
              </>
            )}
            {Platform.OS != 'ios' && (
              <>
                <Text style={[styles.instructionsLabel, { marginTop: 30 }]}>Android</Text>
                <Text style={[styles.instructionsLabel, { fontSize: 16, marginVertical: 10 }]}>*Settings can vary by phone.</Text>
                <Text style={styles.instructionsCopy}>Settings > Apps & Notifications > Advanced > App Name</Text>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  ...Styles,
  notificationContainer: {
    marginVertical: 25,
    marginHorizontal: 10,
  },
  copyContainer: {
    shadowColor: Colors.dropShadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 15,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  headerContainer: {
    paddingRight: 70,
    marginBottom: 30,
  },
  headerLabel: {
    ...Styles.mediumFont,
    fontSize: 24,
    color: Colors.olive,
  },
  instructionsContainer: {

  },
  instructionsCopy: {
    ...Styles.regularFont,
    fontSize: 18,
    lineHeight: 30,
    color: Colors.grey
  },
  instructionsLabel: {
    ...Styles.boldFont,
    fontSize: 18,
    color: Colors.grey,
  }
});