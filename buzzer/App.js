import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import SocketIOClient from 'socket.io-client';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamOneName: "Team 1",
      teamOneScore: 0,
      teamTwoName: "Team 2",
      teamTwoScore: 0,
      teamThreeName: "Team 3",
      teamThreeScore: 0,
      loginVisible: true,
      finalJeopardyWages: false,
      finalJeopardy: false,
      gameRecap: false,
      locked: true,
      user: 'Anonymous',
      wager: 0,
      final: ''
    }
    this.socket = SocketIOClient('http://192.168.1.11:8888');
    this.listen();
  }

  listen = () => { 
    this.socket.on("gameFull", () => { 
      // kick user out
    });

    this.socket.on("playerBuzz", () => { 
      this.setState({ locked: true }); 
    });

    this.socket.on("userGameReset", () => { 
      this.setState({ locked: true }, () => this.displayBuzzer());
    });
 
    this.socket.on("lock", (data) => {
      if(data == true) {
        this.setState({ locked: true }, () => this.displayBuzzer());
      }
      else {
        this.setState({ locked: false }, () => this.displayBuzzer());
      }
    });

    this.socket.on("finalwages", () => {
      this.setState({ finalJeopardyWages: true });
    });

    this.socket.on("finaljeopardy", () => {
      this.setState({ finalJeopardy: true });
    });
 
    this.socket.on("loginCallback", (newTeams) => {
      this.setState({
        teamOneName: newTeams.one.name, teamOneScore: newTeams.one.score,
        teamTwoName: newTeams.two.name, teamTwoScore: newTeams.two.score,
        teamThreeName: newTeams.three.name, teamThreeScore: newTeams.three.score
      });
    });

    this.socket.on("scoreChange", (team, newScore) => {
      if(team === "one") {
        this.setState({ teamOneScore: newScore });
      }
      else if(team === "two") {
        this.setState({ teamTwoScore: newScore });
      }
      else if(team === "three") {
        this.setState({ teamThreeScore: newScore });
      }
    });
  }

  buzzIn = () => {
    this.socket.emit("buzzIn", this.state.user); 
  }

  login = (name) => {
    this.setState({ loginVisible: false });
    this.socket.emit("login", name);
  }

  submitWager = (wager) => {
    this.socket.emit('finalWager', this.state.user, wager);
    this.setState({ finalJeopardyWages: false });
  }

  submitFinal = (answer) => {
    this.socket.emit('finalJeopardy', this.state.user, answer);
    this.setState({ finalJeopardy: false }); // gamerecap = true
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Modal animationType="slide" visible={this.state.loginVisible} transparent={true}>
          <View style={styles.loginContainer}>
            <Text style={styles.header}>This is..{"\n"}Jeopardy!</Text>
            <View style={styles.inputContainer}>
            <TextInput style={styles.teamInput} onChangeText={(val) => this.setState({ user: val })} placeholder="Team Name" placeholderTextColor='white' autoCorrect={false} autoCapitalize="none"></TextInput>
              <TouchableOpacity onPress={() => this.login(this.state.user)}><Text style={styles.submitButton}>Submit</Text></TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal animationType="slide" visible={this.state.finalJeopardyWages} transparent={true}>
          <View style={styles.loginContainer}>
          <Text style={styles.header}>Final Jeopardy Wager</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.teamInput} onChangeText={(val) => this.setState({ wager: val })} placeholder="Wager" placeholderTextColor='white' keyboardType="number-pad"></TextInput>
            <TouchableOpacity onPress={() => this.submitWager(this.state.wager)}><Text style={styles.submitButton}>Submit</Text></TouchableOpacity>
          </View>
          </View>
        </Modal>

        <Modal animationType="slide" visible={this.state.finalJeopardy} transparent={true}>
          <View style={styles.loginContainer}>
            <Text style={styles.header}>Final Jeopardy Answer</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.teamInput} onChangeText={(val) => this.setState({ final: val })} placeholder="Answer" placeholderTextColor='white' autoCorrect={false} autoCapitalize="none"></TextInput>
              <TouchableOpacity onPress={() => this.submitFinal(this.state.final)}><Text style={styles.submitButton}>Submit</Text></TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.buzzerContainer}>
          { this.displayBuzzer() }
          <View style={styles.scoreContainer}>
            <Text style={styles.team} key={this.state.teamOneName}>{ this.state.teamOneName }: <Text style={styles.score}>${this.state.teamOneScore}</Text></Text>
            <Text style={styles.team} key={this.state.teamTwoName }>{ this.state.teamTwoName }: <Text style={styles.score}>${this.state.teamTwoScore}</Text></Text>
            <Text style={styles.team} key={this.state.teamThreeName}>{ this.state.teamThreeName }: <Text style={styles.score}>${this.state.teamThreeScore}</Text></Text>
          </View>
        </View>
      </ScrollView>
   );
  }

  displayBuzzer = () => {
    const enabledBuzzer = <TouchableOpacity key={this.state.locked} style={styles.buzzer} activeOpacity={0.7} onPress={this.buzzIn}><Text style={styles.buzzerText}>Buzz In</Text></TouchableOpacity>;
    const disabledBuzzer = <TouchableOpacity key={this.state.locked} style={[styles.buzzer, { opacity: 0.6 }]} activeOpacity={0.7}><Text style={styles.buzzerText}>Buzz In</Text></TouchableOpacity>;
    return this.state.locked ? disabledBuzzer : enabledBuzzer;
  }
}

const styles = StyleSheet.create({
  // Login Elements
  loginContainer: {
    backgroundColor: '#060CE9',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    width: "100%",
  },
  teamInput: {
    fontSize: 35,
    color: 'white',
    marginBottom: "2.5%",
    backgroundColor: '#060cc7',
    padding: 15,
    textAlign: 'center',
  },
  submitButton: {
    fontSize: 30,
    color: 'white',
    backgroundColor: '#060cc7',
    padding: 15,
    textAlign: 'center',
  },
  // Containers
  container: {
    flex: 1,
    backgroundColor: '#060CE9',
  },
  buzzerContainer: {
    marginTop: "50%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreContainer: {
    backgroundColor: '#060cc7',
    marginTop: "10%",
    width: "100%",
    padding: 20,
    alignItems: "center",
  },
  // Buzzer
  buzzer: {
    backgroundColor: '#f74545',
    borderRadius: 264 / 2,
    width: 264,
    height: 264,
  },
  // Text 
  header: {
    fontSize: 50,
    fontWeight: "bold",
    color: "white",
    marginBottom: "10%",
    textAlign: 'center',
  },
  buzzerText: {
    marginTop: 90,
    marginLeft: 60,
    fontSize: 27.5,
    color: 'whitesmoke',
    alignItems: "center",
    padding: "10%",
  },
  team: {
    padding: 5,
    color: 'whitesmoke',
    fontSize: 25, 
  },
  score: {
    color: 'goldenrod',
    fontSize: 25, 
  },
});
