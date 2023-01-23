import React, {useContext, useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {observer, Observer} from 'mobx-react-lite';
import {toJS} from 'mobx';
import dayjs from 'dayjs';

import {List, Divider, Icon} from '@ui-kitten/components';

// import {readEntriesFromDB, deleteAllEntriesFromDB} from '../db/entry';
import {MSTContext} from '../mst';

import {EntriesType} from '../types/types';
import {Layout} from '../components/Layout';
import EntryCard from '../components/EntryCard';
import NoData from '../components/NoData';

import {useGoogleDrive} from '../utils/GoogleDrive';

// const AddIcon = (props: any) => <Icon {...props} name="plus-outline" />;

// const DATA = [
//   {
//     title: 'Main dishes',
//     data: ['Pizza', 'Burger', 'Risotto'],
//   },
//   {
//     title: 'Sides',
//     data: ['French Fries', 'Onion Rings', 'Fried Shrimps'],
//   },
//   {
//     title: 'Drinks',
//     data: ['Water', 'Coke', 'Beer'],
//   },
//   {
//     title: 'Desserts',
//     data: ['Cheese Cake', 'Ice Cream'],
//   },
// ];

const Entries: React.FC<EntriesType> = observer(({navigation}) => {
  const store = useContext(MSTContext);

  const {exportToGDrive} = useGoogleDrive();

  const [isRefreshing, setRefreshing] = useState(false);

  useEffect(() => {
    refreshData();
    refreshOtherData();
  }, []);

  const refreshData = () => {
    setRefreshing(true);
    store.populateStoreFromDB();
    setRefreshing(false);
  };

  const refreshOtherData = () => {
    store.user.populateUserFromDB();
  };

  // EXPERINMENTAL: Auto Sync
  // useEffect(() => {
  //   // const now = dayjs();
  //   // const lastSyncTime =
  //   //   store?.user.lastSynced !== '' ? dayjs(store?.user.lastSynced) : dayjs();
  //   // const difference = now.diff(lastSyncTime, 'hour');
  //   // console.log('store: ', store);
  //   // console.log('difference: ', difference);
  //   // If used logined && AutoSync enabled && last synced time is greater than 2 hrs
  //   // if (store.user._id !== '' && store.user.isAutoSync && difference > 2) {
  //   //   exportToGDrive();
  //   // }
  // });

  const navigateToDetail = (date = null) => {
    navigation.navigate('EntrySingle', {date});
  };

  // console.log(store);

  const renderItem = ({item}: any) => {
    return (
      <Observer>
        {() => (
          <EntryCard
            key={`entrycard-${item._id}`}
            item={item}
            onPress={() => navigateToDetail(item.date)}
          />
        )}
      </Observer>
    );
  };

  return (
    <Layout>
      {/* <View style={styles.dateWrp}>
        <Text category="c2">Selected date: {date.toLocaleDateString()}</Text>
        <Datepicker date={date} onSelect={nextDate => setDate(nextDate)} />
      </View>
      <Divider /> */}
      {/* <Button title="Fetch" onPress={readEntriesFromDB} /> */}
      {/* <Button
        title="Populate MST from DB"
        onPress={store.populateStoreFromDB}
      /> */}
      {/* <Button title="Delete All" onPress={deleteAllEntriesFromDB} /> */}
      {/* <Button title="Sign In" onPress={signInWithGoogle} /> */}
      {/* <Button title="Update user MST" onPress={store.user.updateUser} /> */}
      <List
        style={styles.list}
        contentContainerStyle={styles.contentContainerStyle}
        data={store.entries}
        extraData={toJS(store.entries)}
        renderItem={renderItem}
        ItemSeparatorComponent={Divider}
        refreshing={isRefreshing}
        onRefresh={refreshData}
        ListEmptyComponent={
          <NoData title="Add a new entry by pressing + button" />
        }
      />
    </Layout>
  );
});

export default Entries;

const styles = StyleSheet.create({
  dateWrp: {
    paddingHorizontal: 16,
  },
  list: {
    paddingTop: 20,
    paddingHorizontal: 16,
    backgroundColor: '#E9ECF2',
  },
  contentContainerStyle: {
    paddingBottom: 100,
    flexGrow: 1,
  },
  btnWrpAbsolute: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  btnAdd: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
  },
});
