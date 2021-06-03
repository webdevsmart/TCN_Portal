import os
import glob
import pymongo
import re
import constants
from datetime import datetime

# constants
LOGS_TYPE = {
    "failCommunicationToPaymentServer" : "FAIL_COMMUNCATION_TO_PAYMENT_SERVER",
    "powerLost" : "POWER_LOST",
    "powerRestore" : "POWER_RESTORE",
}
# end constants

# Mongo Config
myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["vend-portal"]
vendmachines = mydb["vendmachines"]
transactions = mydb["transactions"]
products = mydb["products"]
planograms = mydb["planograms"]

#Project root directory name:
ProjectDirName = "./"
machineUID = ""
devName = ""
siteId = ""

#Append file name:
AppendedLogFileName = "Logs.txt"

# Transaction data model
lastLineStr = ""
# ---------------------------------- card config -------------------------------------
cardTransactionState = {
    "start": False,
    "status": True,
    "time": "",
    "failReason": "",
    "preAuth" : {
        "status" : False,
        "amount" : 0
    },
    "product" : {
        "selectedItem" : "none",
        "price" : 0
    },
    "vendCom" : False,
    "sessionCom" : False,
    "cardType": "unknown",
    "fee": 0,
    "refund": 0,
    "terminalID": "",
    "cardNum": "",
}

# end card pre auth config
# ------------------------------- end card config --------------------------------------

# ------------------------------- cash coin config -------------------------------------
coinTubeLevelFormat = [
    0.00, 0.10, 0.20, 0.50, 0.00, 2.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00
]

cashCoinTransactionState = {
    "start" : False,
    "sessionCom" : False,
    "afterVend" : False,
    "status" : False,
    "time" : False,
    "initialTubeStatus" : "",
    "afterVendTubeStatus" : "",
    "afterPayoutTubeStatus" : "",
    "product" : {
        "selectedItem": "none",
        "price": 0,
    },
    "amount" : False,
    "failReason" : "",
    "routingCoins": [],
    "cashBoxCoins": [],
    "totalVendedPirce": 0,
    "totalRoutedPirce": 0,
    "totalRefundPirce": 0,
}
# ---------------------------- end cash coin config ------------------------------------

# ------------------------------- cash coin config -------------------------------------
billValueLevelFormat = [
    0.00, 0.10, 0.20, 0.50, 0.00, 2.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00
]
cashBillTransactionState = {
    "start" : False,
    "stacked" : False,
    "status" : "",
    "requestNum" : 0,
    "time" : "",
    "product" : {
        "selectedItem": "none",
        "price": 0
    },
    "sessionCom" : False,
    "payRefund" : False,
    "initialTubeStatus" : "",
    "afterRefundTubeStatus" : "",
    "totalVendedPirce": 0,
    "totalRoutedPirce": 0,
    "totalRefundPirce": 0,
    "billLevel": "none",
}
# ---------------------------- end cash coin config ------------------------------------

# ------------------------------- check communication with card server --------------------------------------
failCommunicationToPaymentServer = "CMV300: Giving up sending Obj: "
# ------------------------------- end check communication with card server --------------------------------------

# -------------------------- import config data from logs.txt ----------------------------------------
def ImportConfigData(dir, machine):
    with open(dir) as content:
        lines = content.readlines()
        start = False
        config = {}
        config['machineUID'] = machine[2:len(machine)]
        global machineUID
        machineUID = machine[2:len(machine)]
        config['config'] = {}
        for line in lines:
            if "CONF_START" in line:
                start = True
                continue
            if "CONF_END" in line:
                break
            if not start:
                continue

            item = line.split("=")
            if "DEV_NAME" in line:
                global devName
                global siteId
                devName = item[1]
                siteId = getSiteIdFromDevName(devName)
            config['config'][item[0]] = item[1]

        config['siteId'] = siteId
        vendmachines.update({'machineUID' : config['machineUID']}, config, True)

def getSiteIdFromDevName(devName):
    siteId = ""
    # print(devName)
    searchSite = re.search("S[0-9]{3,4}", devName)
    searchSiteFromD = re.search("D[0-9]{3,4}", devName)
    searchTest = re.search("TEST", devName)
    if searchSite:
        siteId = searchSite.group()
    if searchTest:
        siteId = searchTest.group()
    if searchSiteFromD:
        siteId = searchSiteFromD.group()
    if (siteId == ''):
        siteId = devName
    return siteId

# get productId from product collection using selectedItem.
def getProductIdFromSelectedItem(selectedItem, price):
    result = {'productId': 'unknown', 'aisleNum': selectedItem, 'price': price}
    productId = ''
    planogram = planograms.find_one({ 'machineUID': machineUID })
    # print(selectedItem * 1)
    if planogram:
        for row in planogram['rows']:
            for aisle in row['aisles']:
                if selectedItem.strip(' ').isdigit()  and ( aisle['aisleNum'] == int(selectedItem.strip(' ')) ):
                    if 'productId' in aisle.keys():
                        result['productId'] = aisle['productId']
                        # print(aisle['productId'])
    return result

def calculateTubeLevelFromStatus(tubeStatus):
    statusArray = tubeStatus.split(" ")
    totalPrice = 0
    index = 0
    while index < len(statusArray) - 1:
        totalPrice += coinTubeLevelFormat[index] * 100 * ( int(statusArray[index]) ) 
        index += 1
    return totalPrice

def getTubeLevelBefore(type):
    tubeLevel = 0
    if (type == 'coin'):
        tubeLevel = calculateTubeLevelFromStatus(cashCoinTransactionState['initialTubeStatus'])
    else:
        tubeLevel = calculateTubeLevelFromStatus(cashBillTransactionState['initialTubeStatus'])
    return tubeLevel

def getTubeLevelAfter(type):
    tubeLevel = 0
    if ( type == 'coin' ):
        if ( cashCoinTransactionState['afterPayoutTubeStatus'] != '' ):
            tubeLevel = calculateTubeLevelFromStatus( cashCoinTransactionState['afterPayoutTubeStatus'] )
        else:
            if ( cashCoinTransactionState['afterVendTubeStatus'] != '' ):
                tubeLevel = calculateTubeLevelFromStatus( cashCoinTransactionState['afterVendTubeStatus'] )
            else:
                tubeLevel = calculateTubeLevelFromStatus( cashCoinTransactionState['initialTubeStatus'] )
    else:
        if ( cashBillTransactionState['afterRefundTubeStatus'] != '' ):
            tubeLevel = calculateTubeLevelFromStatus( cashBillTransactionState['afterRefundTubeStatus'] )
        else:
            tubeLevel = calculateTubeLevelFromStatus( cashBillTransactionState['initialTubeStatus'] )
    return tubeLevel
# ---------------------------import log data from logs.txt ------------------------------------------
def ImportLogData(dir):
    with open(dir) as content:
        for line_no, line in enumerate(content):
            # get current time
            if re.match("[0-9]{4}\-[0-9]{2}\-[0-9]{2}\ [0-9]{2}:[0-9]{2}:[0-9]{2}:[0-9]{3}", line[0:23]):
                time = datetime.strptime(line[0:23], '%Y-%m-%d %H:%M:%S:%f')
            # end get current time
            setBillValueLevelFormat(line)
            setCoinTubeLevelFormat(line)
            checkCardTransaction(line, time, line_no + 1)
            # checkCommunicationToPaymentServer(line, time)
            checkCashCoinTransaction(line, time, line_no + 1)
            checkCashBillTransaction(line, time, line_no + 1)

# ----------------------------card log analyse--------------------------------
def formatCardTransaction():
    global cardTransactionState

    cardTransactionState = {
        "start": False,
        "status": True,
        "time": "",
        "failReason": "",
        "preAuth" : {
            "status" : False,
            "amount" : 0
        },
        "product" : {
            "selectedItem" : "none",
            "price" : 0
        },
        "vendCom" : False,
        "sessionCom" : False,
        "cardType": "unknown",
        "fee": 0,
        "refund": 0,
        "terminalID": "",
        "cardNum": "",
    }
    # print(cardTransactionState['start'])

def checkCardTransaction(line, time, line_no):
    global cardTransactionState
    # card Transaction start

    if constants.CARD_TANSACTION_START in line:
        formatCardTransaction()
        cardTransactionState['start'] = True

    # --------- pre auth--------
    # card pre auth ok
    if constants.CARD_PRE_AUTH_OK in line and cardTransactionState['start']:
        cardTransactionState['preAuth']['status'] = True
        preAuthAmnt = re.search(constants.CARD_PRE_AUTH_AMOUNT_PATTERN, line)
        if preAuthAmnt:
            cardTransactionState['preAuth']['amount'] = float(preAuthAmnt.group(1))
        else:
            cardTransactionState['preAuth']['amount'] = 0
    # card pre auth fail
    if any(x in line for x in constants.CARD_PRE_AUTH_FAIL) and cardTransactionState['start']:
        cardTransactionState['time'] = time
        cardTransactionState['failReason'] = constants.CARD_FAIL_REASON['PRE_AUTH_FAIL'] + " line:" + line
        setCardTransactionResult("failed")
            
    # -------- end pre auth ------------

    # ------------ product ---------------
    if constants.CARD_SELECT_ITEM in line and cardTransactionState['start']:
        selectedItem = re.search(constants.CARD_SELECTED_ITEM_PATTERN, line)
        if selectedItem:
            cardTransactionState['product']['selectedItem'] = selectedItem.group(1)
        itemPrice = re.search(constants.ITEM_PRICE_PATTERN, line)
        if itemPrice:
            cardTransactionState['product']['price'] = round(float(itemPrice.group(1)) * 100, 2)

    if constants.CARD_NO_ITEM_SELECTED in line and cardTransactionState['start']:
        cardTransactionState['time'] = time
        cardTransactionState['failReason'] = constants.CARD_FAIL_REASON['NO_ITEM_SELECTED'] + " line: " + line

    # ------------ end product ---------------

    # card vend cancel
    if constants.CARD_VEND_FAIL_CANCEL in line and cardTransactionState['start']:
        cardTransactionState['time'] = time
        cardTransactionState['failReason'] = constants.CARD_FAIL_REASON['VEND_FAIL_SEND_CANCEL'] + " line: " + line
        cardTransactionState['refund'] = cardTransactionState['preAuth']['amount']
        setCardTransactionResult("failed")   

    if constants.CARD_VEND_FAIL_VOID in line and cardTransactionState['start']:
        cardTransactionState['time'] = time
        cardTransactionState['failReason'] = constants.CARD_FAIL_REASON['VEND_FAIL_SEND_VOID'] + " line: " + line
        cardTransactionState['refund'] = cardTransactionState['preAuth']['amount']
    # end card vend cancel

    if constants.CARD_VEND_SUCCESS in line and cardTransactionState['start']:
        cardTransactionState['vendCom'] = True

    if constants.CARD_SESSION_COM in line and cardTransactionState['start'] and cardTransactionState['vendCom']:
        cardTransactionState['sessionCom'] = True
    # card transaction success
     
    if constants.CARD_TXN_AUTH_CANCEL in line and not cardTransactionState['preAuth']['status']:
        cardTransactionState['time'] = time
        cardTransactionState['failReason'] = constants.CARD_FAIL_REASON['TXN_AUTH_CANCEL'] + " line: " + line
        setCardTransactionResult("failed")          
    # end card transaction success

    # card transaction get1
    if constants.CARD_GET1 in line and cardTransactionState['start'] and cardTransactionState['preAuth']['status']:
        get1Res = re.search(constants.CARD_GET1_VALUE_PATTERN, line)
        cardTransactionState['time'] = time
        if get1Res and (len(get1Res.group(1)) > 1):
            dataArray = get1Res.group(1).split(',')
            cardTransactionState['cardType'] = dataArray[1]
            if (len(dataArray) >= 18):
                cardTransactionState['fee'] = dataArray[18]
            else: 
                cardTransactionState['fee'] = 0
            # print(len(dataArray))
            # print(line_no)
            if (len(dataArray) >= 23):
                cardTransactionState['terminalID'] = dataArray[23]
            else:
                cardTransactionState['terminalID'] = "unknown"

            if (len(dataArray) >= 16):
                cardTransactionState['cardNum'] = dataArray[16]
            else:
                cardTransactionState['cardNum'] = "unknown"

            if (len(dataArray) >= 14 and dataArray[14] == 'COMP'):
                setCardTransactionResult("success")
            elif (len(dataArray) >= 14 and dataArray[14] == 'VOID'):
                # cardTransactionState['failReason'] = "TXN GET1: Auth: VOID"
                cardTransactionState['refund'] = dataArray[3]
                setCardTransactionResult("failed")

    # end card transaction get1

def setCardTransactionResult (type):
    global cardTransactionState

    data = {
        "machineUID" : machineUID,
        "devName" : devName,
        "siteId" : siteId,
        "type" : "CARD",
        "subType" : cardTransactionState['cardType'],
        "status" : type,
        "time" : cardTransactionState['time'],
        "product" : getProductIdFromSelectedItem(cardTransactionState['product']['selectedItem'], cardTransactionState['product']['price']),
        # "price" : cardTransactionState['product']['price'],
        "fee" : cardTransactionState['fee'],
        "refund" : cardTransactionState['refund'],
        "failReason" : cardTransactionState['failReason']
    }
    transactions.update({'machineUID' : data['machineUID'], 'time': data['time']}, data, True)
    # print(cardTransactionState)
    formatCardTransaction()
# ----------------------------------end card-----------------------------

# check communication to payment server
def checkCommunicationToPaymentServer(line, time):
    if failCommunicationToPaymentServer in line:
        data = {
            "time": time,
            "logType": LOGS_TYPE['failCommunicationToPaymentServer'],
            "logText": line
        }
        vendmachines.update({'machineUID': machineUID}, {'$push': {'logs': data}})
# end check communication to payment server

# check power on or off
def checkPower(line, time):
    if "DEV: Power lost" in line:
        data = {
            "time": time,
            "logType": LOGS_TYPE['powerLost'],
            "logText": line
        }
        vendmachines.update({'machineUID': machineUID}, {'$push': {'logs': data}})
    if "DEV: Power restored" in line:
        data = {
            "time": time,
            "logType": LOGS_TYPE['powerRestore'],
            "logText": line
        }
        vendmachines.update({'machineUID': machineUID}, {'$push': {'logs': data}})
# end check power on or off

# ---------------------check cash transaction---------------------------




def setCoinTubeLevelFormat(line):
    global coinTubeLevelFormat
    array = []
    if constants.CASH_COIN_CONFIG in line:
        values = re.search(constants.CASH_CONFIG_PATTERN, line)
        if values:
            arr = values.group(1).split(" ")
            for item in arr:
                if item != '':
                    value = float(item)
                    array.insert(len(array), value)

    for index, line in enumerate(array):
        coinTubeLevelFormat[index] = array[index]

def checkCashCoinTransaction(line, time, line_no):
    global cashCoinTransactionState
    if constants.CASH_COIN_TUBE_LEVEL in line and not cashCoinTransactionState['start']:
        initialTubeStatus = re.search(constants.CASH_COIN_TUBE_LEVEL_PATTERN, line)
        if initialTubeStatus:
            cashCoinTransactionState['initialTubeStatus'] = initialTubeStatus.group(1)

    if constants.CASH_COIN_ROUTING_TUBES in line and cashCoinTransactionState['sessionCom']:
        formatCashCoinTransaction(cashCoinTransactionState['afterPayoutTubeStatus'])

    # add coin
    if constants.CASH_COIN_ROUTING_TUBES in line and not cashCoinTransactionState['sessionCom']:
        cashCoinTransactionState['start'] = True
        cashCoinTubeStatusArray = cashCoinTransactionState['initialTubeStatus'].split(" ")

        numOfCoin = re.search(constants.CASH_COIN_ROUTING_LEVEL, line)
        if numOfCoin:
            cashCoinTransactionState['routingCoins'].insert(0, numOfCoin.group(1))
        
        tubeLevel = re.search(constants.CASH_COIN_ROUTING_PRICE, line)
        if tubeLevel and tubeLevel.group(1) != '0':
            cashCoinTransactionState['totalRoutedPirce'] += float(tubeLevel.group(1)) * 100
    # end add coin

    if constants.CASH_COIN_ROUTING_CASH_BOX in line and not cashCoinTransactionState['sessionCom']:
        cashCoinTransactionState['start'] = True
        # print(line_no)
        # print(cashCoinTransactionState)

        coinNumber = re.search(constants.CASH_COIN_ROUTING_LEVEL, line)
        if coinNumber:
            cashCoinTransactionState['cashBoxCoins'].insert(len(cashCoinTransactionState['cashBoxCoins']), coinNumber.group(1))

    if constants.CASH_SELECT_ITEM in line and cashCoinTransactionState['start'] and not cashCoinTransactionState['sessionCom']:
        product = {}
        selectedItem = re.search(constants.CASH_SELECTED_ITEM_PATTERN, line)
        if selectedItem:
            product['selectedItem'] = selectedItem.group(1)
        price = re.search(constants.ITEM_PRICE_PATTERN, line)
        if price:
            product['price'] = round(float(price.group(1)) * 100, 2)
        cashCoinTransactionState['product'] = product

    if constants.CASH_SESSION_COMPLETE in line and cashCoinTransactionState['start']:
        cashCoinTransactionState['totalVendedPirce'] = getTotalVendPrice()
        cashCoinTransactionState['sessionCom'] = True
        if (len(cashCoinTransactionState['initialTubeStatus']) > 0):
            
            cashCoinTransactionState['totalRoutedPirce'] = getRoutedCoinPrice()

            if (cashCoinTransactionState['totalVendedPirce'] == cashCoinTransactionState['totalRoutedPirce']):
                cashCoinTransactionState['time'] = time
                cashCoinTransactionState['totalRefundPrice'] = 0
                if (cashCoinTransactionState['product']['selectedItem'] == "none"): 
                    cashCoinTransactionState['failReason'] = constants.CASH_COIN_FAIL_REASON['NO_ITEM_SELECTED']
                    setCashCoinTransaction("failed", time, line_no)    
                else:
                    setCashCoinTransaction("success", time, line_no)

        if cashCoinTransactionState['sessionCom']:
            formatCashCoinTransaction(cashCoinTransactionState['initialTubeStatus'])

    if constants.CASH_COIN_TUBE_LEVEL in line and cashCoinTransactionState['start'] and not cashCoinTransactionState['afterVend'] and cashCoinTransactionState['sessionCom']:
        afterVendTubeStatus = re.search(constants.CASH_COIN_TUBE_LEVEL_PATTERN, line)
        if afterVendTubeStatus:
            print("------------------------------------")
            cashCoinTransactionState['afterVendTubeStatus'] = afterVendTubeStatus.group(1)
            cashCoinTransactionState['totalRoutedPirce'] = getRoutedCoinPriceFromVendedLevel()
            # print(line_no)
            if (cashCoinTransactionState['totalVendedPirce'] == cashCoinTransactionState['totalRoutedPirce']):
                if (cashCoinTransactionState['product']['selectedItem'] == "none"): 
                    cashCoinTransactionState['failReason'] = constants.CASH_COIN_FAIL_REASON['NO_ITEM_SELECTED']
                    setCashCoinTransaction("failed", time, line_no)    
                else:
                    setCashCoinTransaction("success", time, line_no)

    if constants.CASH_COIN_PAY_OUT in line and cashCoinTransactionState['start']:
        cashCoinTransactionState['afterVend'] = True
        # print(line_no)

    if constants.CASH_COIN_TUBE_LEVEL in line and cashCoinTransactionState['start'] and cashCoinTransactionState['afterVend']:
        afterPayoutTubeStatus = re.search(constants.CASH_COIN_TUBE_LEVEL_PATTERN, line)
        if afterPayoutTubeStatus:
            cashCoinTransactionState['afterPayoutTubeStatus'] = afterPayoutTubeStatus.group(1)
            cashCoinTransactionState['totalRefundPrice'] = getRefundPrice()
            cashCoinTransactionState['cashBoxPrice'] = getCashBoxPrice()
            if (cashCoinTransactionState['totalRoutedPirce'] + cashCoinTransactionState['cashBoxPrice'] == cashCoinTransactionState['totalVendedPirce'] + cashCoinTransactionState['totalRefundPrice']):
                if (cashCoinTransactionState['product']['selectedItem'] == "none"): 
                    cashCoinTransactionState['failReason'] = constants.CASH_COIN_FAIL_REASON['NO_ITEM_SELECTED']
                    setCashCoinTransaction("failed", time, line_no)    
                else:
                    setCashCoinTransaction("success", time, line_no)
            elif (countZeroCashBox() > 0):
                
                if (cashCoinTransactionState['totalRoutedPirce'] + cashCoinTransactionState['cashBoxPrice'] + countZeroCashBox() * 100 == cashCoinTransactionState['totalVendedPirce'] + cashCoinTransactionState['totalRefundPrice']):
                    if (cashCoinTransactionState['product']['selectedItem'] == "none"): 
                        cashCoinTransactionState['failReason'] = constants.CASH_COIN_FAIL_REASON['NO_ITEM_SELECTED']
                        setCashCoinTransaction("failed", time, line_no)    
                    else:
                        setCashCoinTransaction("success", time, line_no)
            else:
                if (cashCoinTransactionState['totalRefundPrice'] == cashCoinTransactionState['totalRoutedPirce'] + cashCoinTransactionState['cashBoxPrice']):
                    cashCoinTransactionState['failReason'] = constants.CASH_COIN_FAIL_REASON['TOTAL_REFUNDED']
                    setCashCoinTransaction("failed", time, line_no)
                else:
                    if (cashCoinTransactionState['product']['selectedItem'] == "none"): 
                        cashCoinTransactionState['failReason'] = constants.CASH_COIN_FAIL_REASON['NO_ITEM_SELECTED']
                        setCashCoinTransaction("failed", time, line_no)    
                    else:
                        setCashCoinTransaction("success", time, line_no)
                    

            

    # if "MDBS: COINCH: TubeFull:" in line and cashCoinTransactionState['start']:
    #     endTubeStatus = re.search("TubeStatus: (.+?)\.\n", line)
    #     if endTubeStatus:
    #         cashCoinTransactionState['endTubeStatus'] = endTubeStatus.group(1)
        # cashCoinTransactionState = formatCashCoinTransaction()

def formatCashCoinTransaction(lastTubeStatus = ""):
    global cashCoinTransactionState

    cashCoinTransactionState = {
        "start" : False,
        "sessionCom" : False,
        "afterVend" : False,
        "status" : False,
        "time" : False,
        "initialTubeStatus" : lastTubeStatus,
        "afterVendTubeStatus" : "",
        "afterPayoutTubeStatus" : "",
        "product" : {
            "selectedItem": "none",
            "price": 0,
        },
        "amount" : False,
        "failReason" : "",
        "routingCoins": [],
        "cashBoxCoins": [],
        "totalVendedPirce": 0,
        "totalRoutedPirce": 0,
        "totalRefundPirce": 0,
    }

def getRoutedCoinPrice():
    if cashCoinTransactionState['totalRoutedPirce'] > 0:
        return cashCoinTransactionState['totalRoutedPirce']
    else:
        tubeLevelArray = cashCoinTransactionState['initialTubeStatus'].split(" ")
        totalRoutedCoinPrice = 0
        for coin in cashCoinTransactionState['routingCoins']:
            lastCoinLevel = int(coin) - 1;
            if str(lastCoinLevel) in tubeLevelArray:
                index = tubeLevelArray.index(str(lastCoinLevel))
                totalRoutedCoinPrice += coinTubeLevelFormat[index] * 100

        return totalRoutedCoinPrice

def getRoutedCoinPriceFromVendedLevel():
    if cashCoinTransactionState['totalRoutedPirce'] > 0:
        return cashCoinTransactionState['totalRoutedPirce']
    else:
        tubeLevelArray = cashCoinTransactionState['afterVendTubeStatus'].split(" ")
        totalRoutedCoinPrice = 0
        for coin in cashCoinTransactionState['routingCoins']:
            if str(coin) in tubeLevelArray:
                index = tubeLevelArray.index(str(coin))
                tubeLevelArray[index] = str(int(tubeLevelArray[index]) - 1)
                totalRoutedCoinPrice += coinTubeLevelFormat[index] * 100
                # print(index)
            # index = tubeLevelArray.index(coin)
        return totalRoutedCoinPrice        

def getRefundPrice():
    vendTubeLevelArray = cashCoinTransactionState['afterVendTubeStatus'].split(" ")
    payoutTubeLevelArray = cashCoinTransactionState['afterPayoutTubeStatus'].split(" ")
    totalRefundPrice = 0
    index = 0

    while index < len(vendTubeLevelArray) - 1:
        totalRefundPrice += coinTubeLevelFormat[index] * 100 * (int(vendTubeLevelArray[index]) - int(payoutTubeLevelArray[index]))
        index += 1

    return totalRefundPrice  

def getCashBoxPrice():
    totalPrice = 0
    vendTubeLevelArray = cashCoinTransactionState['afterVendTubeStatus'].split(" ")
    for cashCoin in cashCoinTransactionState['cashBoxCoins']:
        if str(cashCoin) in vendTubeLevelArray:
            index = vendTubeLevelArray.index(str(cashCoin))
            totalPrice += coinTubeLevelFormat[index] * 100

    return totalPrice

def countZeroCashBox():
    count = 0;
    for cashCoin in cashCoinTransactionState['cashBoxCoins']:
        if (cashCoin == '0'):
            count += 1
    return count

def getTotalVendPrice():
    totalVendedPirce = cashCoinTransactionState['product']['price']
    # for item in cashCoinTransactionState['product']:
    #     totalVendedPirce += item['price']

    return totalVendedPirce

def setCashCoinTransaction(type, time, line_no):
    global cashCoinTransactionState
    data = {
        "machineUID" : machineUID,
        "devName" : devName,
        "siteId" : siteId,
        "type" : "CASH", 
        "subType" : "COIN",
        "status" : type,
        "time" : time,
        "product" : getProductIdFromSelectedItem(cashCoinTransactionState['product']['selectedItem'], cashCoinTransactionState['product']['price']),
        "refund" : cashCoinTransactionState['totalRefundPrice'],
        "failReason" : cashCoinTransactionState['failReason'],
        "tubeLevelBefore" : getTubeLevelBefore('coin'),
        "tubeLevelAfter" : getTubeLevelAfter('coin')
    }
    if (data['product'] != "none"):
        transactions.update({'machineUID' : data['machineUID'], 'time': data['time']}, data, True)
    
    # print(type)
    formatCashCoinTransaction(cashCoinTransactionState['afterPayoutTubeStatus'])
# ---------------------end check cash transaction------------------------------

# --------------------------- check cash bill note ----------------------------
def setBillValueLevelFormat(line):
    global billValueLevelFormat
    array = []
    if "MDBS: BILLV: CONFIG:" in line:
        values = re.search("BillValues\(\$\): (.+?)\n", line)
        if values:
            arr = values.group(1).split(" ")
            for item in arr:
                if item != '':
                    value = float(item) * 100
                    array.insert(len(array), value)

    for index, line in enumerate(array):
        billValueLevelFormat[index] = array[index]

def checkCashBillTransaction(line, time, line_no):
    global cashBillTransactionState
    if constants.CASH_COIN_TUBE_LEVEL in line and not cashBillTransactionState['start']:
        initialTubeStatus = re.search(constants.CASH_COIN_TUBE_LEVEL_PATTERN, line)
        if initialTubeStatus:
            cashBillTransactionState['initialTubeStatus'] = initialTubeStatus.group(1)

    if constants.CASH_BILL_ESCROWED in line:
        if cashBillTransactionState['start']:
            cashBillTransactionState = formatcashBillTransaction()
        cashBillTransactionState['start'] = True
        billLevel = re.search("BILLV: Escrowed: (.+?), NumOfBills", line)
        if billLevel:
            cashBillTransactionState['billLevel'] = billLevel.group(1)

    if "MDBS: COINCH: Escrow Request." in line and cashBillTransactionState['start']:
        cashBillTransactionState['requestNum'] += 1


    if "BILLV: Bill Returned: " in line and cashBillTransactionState['start'] and (cashBillTransactionState['requestNum'] > 0):
        setCashBillTransaction("fail", time, "Requested")

    if "MDBS: BILLV: Stacked: " in line and cashBillTransactionState['start']:
        cashBillTransactionState['stacked'] = True

    if "MDBS: OTHER <= VEND REQUEST Item:" in line and cashBillTransactionState['start'] and cashBillTransactionState['stacked']:
        cashBillTransactionState['product'] = {}
        item = re.search("REQUEST Item: (.+?), Price", line)
        if item:
            cashBillTransactionState['product']['selectedItem'] = item.group(1)
        price = re.search("Price: (.+?)\.\n", line)
        if price:
            cashBillTransactionState['product']['price'] = round(float(price.group(1)) * 100, 2)

    if "MDBS: OTHER <= SESSION COMPLETE." in line and cashBillTransactionState['start'] and cashBillTransactionState['stacked']:
        cashBillTransactionState['sessionCom'] = True

    if "MDBS: COINCH: TubeFull:" in line and cashBillTransactionState['start'] and cashBillTransactionState['stacked'] and cashBillTransactionState['sessionCom'] and not cashBillTransactionState['payRefund']:
        cashBillTransactionState['initialTubeStatus'] = re.search(", TubeStatus: (.+?)\ \.\n", line).group(1)


    if "MDBS: COINCH: Payout Status Total:" in line and cashBillTransactionState['sessionCom']:
        cashBillTransactionState['payRefund'] = True

    if "MDBS: COINCH: TubeFull:" in line and cashBillTransactionState['start'] and cashBillTransactionState['stacked'] and cashBillTransactionState['sessionCom'] and cashBillTransactionState['payRefund']:
        cashBillTransactionState['afterRefundTubeStatus'] = re.search(", TubeStatus: (.+?)\ \.\n", line).group(1)
        cashBillTransactionState['totalRefundPirce'] = calculateBillRefundPrice()
        if float(cashBillTransactionState['totalRefundPirce']) + float(cashBillTransactionState['product']['price']) * 100 in billValueLevelFormat:
            index = billValueLevelFormat.index(float(cashBillTransactionState['totalRefundPirce']) + float(cashBillTransactionState['product']['price']) * 100)
            cashBillTransactionState['billLevel'] = billValueLevelFormat[index] / 100
            if (cashBillTransactionState['product']['selectedItem'] == "none"):
                setCashBillTransaction("fail", time, "No Item selected")
            else:   
                setCashBillTransaction("success", time)
        elif float(cashBillTransactionState['totalRefundPirce']) in billValueLevelFormat:
            index = billValueLevelFormat.index(float(cashBillTransactionState['totalRefundPirce']))
            cashBillTransactionState['billLevel'] = billValueLevelFormat[index] / 100
            setCashBillTransaction("fail", time, "Totally Refund")

def formatcashBillTransaction(lastTubeStatus = ""):
    return {
        "start" : False,
        "stacked" : False,
        "status" : "",
        "requestNum" : 0,
        "time" : "",
        "product" : {
            "selectedItem": "none",
            "price": 0
        },
        "sessionCom" : False,
        "payRefund" : False,
        "initialTubeStatus" : lastTubeStatus,
        "afterRefundTubeStatus" : "",
        "totalVendedPirce": 0,
        "totalRoutedPirce": 0,
        "totalRefundPirce": 0,
        "billLevel": "none",
    }

def setCashBillTransaction(type, time, failReason = ""):
    global cashBillTransactionState
    
    data = {
        "machineUID" : machineUID,
        "devName" : devName,
        "siteId" : siteId,
        "type" : "CASH", 
        "subType" : "BILL",
        "status" : type,
        "time" : time,
        "product" : getProductIdFromSelectedItem(cashBillTransactionState['product']['selectedItem'], cashBillTransactionState['product']['price']),
        "refund" : cashBillTransactionState['totalRefundPirce'],
        "billLevel" : cashBillTransactionState['billLevel'],
        "failReason": failReason,
        "tubeLevelBefore" : getTubeLevelBefore('bill'),
        "tubeLevelAfter" : getTubeLevelAfter('bill')
    }
    # print(cashBillTransactionState)
    if (data['product'] != "none"):
        transactions.update({'machineUID' : data['machineUID'], 'time': data['time']}, data, True)
    cashBillTransactionState = formatcashBillTransaction(cashBillTransactionState['initialTubeStatus'])

def calculateBillRefundPrice():
    totalPrice = 0
    initTubeLevelArray = cashBillTransactionState['initialTubeStatus'].split(" ")
    afterRefundTubeLevelArray = cashBillTransactionState['afterRefundTubeStatus'].split(" ")
    index = 0

    while index < len(initTubeLevelArray) - 1:
        totalPrice += coinTubeLevelFormat[index] * 100 * (int(initTubeLevelArray[index]) - int(afterRefundTubeLevelArray[index]))
        index += 1

    return totalPrice  

# --------------------------- end check cash bill note ---------------------------

def importMachineData(dir):
    global cardTransactionState
    global cashCoinTransactionState
    global cashBillTransactionState
    formatCardTransaction()
    formatCashCoinTransaction("")
    cashBillTransactionState = formatcashBillTransaction()
    currDir = os.getcwd();
    os.chdir(dir);
    subDirs = glob.glob("./*")
    print(dir)

    for subDir in subDirs:
        if (subDir[2:len(subDir)] == 'dev.conf'):
            ImportConfigData(subDir, dir)
        if (subDir[2:len(subDir)] == 'Logs.txt'):
            ImportLogData(subDir)
    os.chdir(currDir);

def main():
    os.chdir(ProjectDirName);
    deviceDirs = glob.glob("./*")
    for dir in deviceDirs:
        if (len(dir) == 34):
            # if "03E60C245339393338202020FF06191A" in dir:
            importMachineData(dir);
            
    


if __name__ == "__main__":
    main()