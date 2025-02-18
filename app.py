from flask import Flask, render_template, request, jsonify
import os
import requests
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.linear_model import LogisticRegression

app = Flask(__name__)

# Twitter API Configuration
BEARER_TOKEN = os.getenv("BEARER_TOKEN", "AAAAAAAAAAAAAAAAAAAAAANoxAEAAAAARIratdNtUpsn7Gxk5YZHrDgXVmI%3DhdjZY09cKTCe7xAioFXli8PM2qq68rtGjVcqFwYAvGjlnAARsY")
API_ENDPOINT = "https://api.twitter.com/2/users/by/username/"

# Features adjusted for Twitter API v2 capabilities
REQUIRED_FEATURES = ['followers_count', 'friends_count', 'statuses_count', 'listed_count']

class TwitterAccountAnalyzer:
    def __init__(self):
        self.models = {}
        self.scaler = MinMaxScaler()
        self.static_data = self.load_static_data()
        
        # Initialize and train models
        self.initialize_models()
        self.train_models()

    def initialize_models(self):
        self.models = {
            'rf': RandomForestClassifier(n_estimators=150, random_state=42),
            'gb': GradientBoostingClassifier(n_estimators=150, random_state=42),
            'lr': LogisticRegression(max_iter=1000),
            'voting': VotingClassifier(
                estimators=[('rf', self.models['rf']), ('gb', self.models['gb']), ('lr', self.models['lr'])],
                voting='soft'
            )
        }

    def train_models(self):
        X = self.static_data[REQUIRED_FEATURES]
        y = self.static_data['label']
        X_scaled = self.scaler.fit_transform(X)
        
        for name, model in self.models.items():
            if name != 'voting':
                model.fit(X_scaled, y)
        self.models['voting'].fit(X_scaled, y)

    def load_static_data(self):
        users_df = pd.read_csv('users.csv')
        fusers_df = pd.read_csv('fusers.csv')
        users_df['label'] = 0  # Genuine
        fusers_df['label'] = 1  # Fake
        return pd.concat([users_df, fusers_df], ignore_index=True)

    def predict(self, user_df):
        X = user_df[REQUIRED_FEATURES]
        X_scaled = self.scaler.transform(X)
        prediction = self.models['voting'].predict(X_scaled)
        probability = self.models['voting'].predict_proba(X_scaled)[0]
        return prediction, probability

analyzer = TwitterAccountAnalyzer()

def get_twitter_data(username):
    headers = {"Authorization": f"Bearer {BEARER_TOKEN}"}
    params = {"user.fields": "public_metrics,created_at,description,verified"}
    
    try:
        response = requests.get(
            f"{API_ENDPOINT}{username}",
            headers=headers,
            params=params
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return None

def parse_twitter_data(user_data):
    metrics = user_data['data']['public_metrics']
    return pd.DataFrame([{
        'followers_count': metrics['followers_count'],
        'friends_count': metrics['following_count'],
        'statuses_count': metrics['tweet_count'],
        'listed_count': metrics['listed_count']
    }])

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    username = request.form['username'].strip().lstrip('@')
    if not username:
        return render_template('error.html', error="Please enter a username"), 400
    
    try:
        user_data = get_twitter_data(username)
        if not user_data or 'data' not in user_data:
            return render_template('error.html', error="User not found or API error"), 404
        
        user_df = parse_twitter_data(user_data)
        prediction, probability = analyzer.predict(user_df)
        confidence = round(max(probability) * 100, 1)
        
        result = {
            'username': username,
            'prediction': 'fake' if prediction[0] == 1 else 'genuine',
            'confidence': confidence,
            'features': user_df.iloc[0].to_dict(),
            'account_data': {
                'created_at': user_data['data'].get('created_at', 'N/A'),
                'verified': user_data['data'].get('verified', False),
                'description': user_data['data'].get('description', '')
            }
        }
        return render_template('result.html', result=result)
    
    except Exception as e:
        return render_template('error.html', error=str(e)), 500

if __name__ == '__main__':
    app.run(debug=True)
