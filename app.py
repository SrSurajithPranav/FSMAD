from flask import Flask, render_template, request, jsonify
import os
import requests
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.linear_model import LogisticRegression
from datetime import datetime

app = Flask(__name__)

# Custom Jinja2 filters
@app.template_filter('comma')
def comma_filter(value):
    return f"{int(value):,}"

@app.template_filter('format_date')
def format_date_filter(date_str):
    if not date_str or date_str == 'N/A':
        return 'N/A'
    try:
        date_obj = datetime.strptime(date_str, '%Y-%m-%dT%H:%M:%S.%fZ')
        return date_obj.strftime('%b %d, %Y')
    except ValueError:
        return date_str

# Twitter API Configuration with multiple bearer tokens
BEARER_TOKENS = [
    os.getenv("AAAAAAAAAAAAAAAAAAAAAANoxAEAAAAARIratdNtUpsn7Gxk5YZHrDgXVmI%3DhdjZY09cKTCe7xAioFXli8PM2qq68rtGjVcqFwYAvGjlnAARsY"),
    os.getenv("AAAAAAAAAAAAAAAAAAAAALOhywEAAAAAW8Oi86wzl4ft4tnhzRlyZ3%2FFGF8%3D4ItRbnSYTeK9jcWopAugYeMcqfAOypNi5gBERQ4wBjY4aq9phL"),
    os.getenv("AAAAAAAAAAAAAAAAAAAAACzpygEAAAAA8k18d8ZP23NtWodqYI5x6mwfS58%3DDLK7sv0qrqEu7u7bovNoHegux5EkHiVhKqp41jPV1mKzYRcQMm"),
    os.getenv("AAAAAAAAAAAAAAAAAAAAACg7zAEAAAAABBikdwYlorE2FeNpNqrkT8uV1fk%3DsxxU1YZAYwO0G56tjTPSElgal0CEy0HF3zJ4a5jtpmTdRyO4h7")
]
API_ENDPOINT = "https://api.twitter.com/2/users/by/username/"

REQUIRED_FEATURES = ['followers_count', 'friends_count', 'statuses_count', 'listed_count']

class TwitterAccountAnalyzer:
    def __init__(self):
        self.models = {}
        self.scaler = MinMaxScaler()
        self.static_data = self.load_static_data()
        self.initialize_models()
        self.train_models()

    def initialize_models(self):
        self.models['rf'] = RandomForestClassifier(n_estimators=150, random_state=42)
        self.models['gb'] = GradientBoostingClassifier(n_estimators=150, random_state=42)
        self.models['lr'] = LogisticRegression(max_iter=1000)
        self.models['voting'] = VotingClassifier(
            estimators=[('rf', self.models['rf']), ('gb', self.models['gb']), ('lr', self.models['lr'])],
            voting='soft'
        )

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
        users_df['label'] = 0
        fusers_df['label'] = 1
        combined_df = pd.concat([users_df, fusers_df], ignore_index=True)
        return combined_df

    def predict(self, user_df):
        X = user_df[REQUIRED_FEATURES]
        X_scaled = self.scaler.transform(X)
        prediction = self.models['voting'].predict(X_scaled)
        probability = self.models['voting'].predict_proba(X_scaled)[0]
        return prediction, probability

    def get_static_user_data(self, name):
        user_data = self.static_data[self.static_data['name'] == name]
        if not user_data.empty:
            return user_data[REQUIRED_FEATURES].iloc[0:1]
        return None

analyzer = TwitterAccountAnalyzer()

def get_twitter_data(username):
    params = {"user.fields": "public_metrics,created_at,description,verified"}
    
    for token in BEARER_TOKENS:
        headers = {"Authorization": f"Bearer {token}"}
        try:
            response = requests.get(f"{API_ENDPOINT}{username}", headers=headers, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException:
            continue
    
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
    static_users = analyzer.static_data['name'].tolist()
    return render_template('index.html', static_users=static_users)

@app.route('/analyze', methods=['POST'])
def analyze():
    username = request.form['username'].strip().lstrip('@')
    if not username:
        return render_template('error.html', error="Please enter a username"), 400
    
    try:
        user_data = get_twitter_data(username)
        
        if user_data and 'data' in user_data:
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
                    'description': user_data['data'].get('description', ''),
                    'source': 'Twitter API'
                }
            }
            return render_template('result.html', result=result)
        
        static_data = analyzer.get_static_user_data(username)
        if static_data is not None:
            prediction, probability = analyzer.predict(static_data)
            confidence = round(max(probability) * 100, 1)
            
            result = {
                'username': username,
                'prediction': 'fake' if prediction[0] == 1 else 'genuine',
                'confidence': confidence,
                'features': static_data.iloc[0].to_dict(),
                'account_data': {
                    'created_at': 'N/A',
                    'verified': False,
                    'description': 'Data from static dataset',
                    'source': 'Static Dataset'
                }
            }
            return render_template('result.html', result=result)
        
        return render_template('error.html', error="User not found in API or static dataset"), 404
    
    except Exception as e:
        return render_template('error.html', error=str(e)), 500

if __name__ == '__main__':
    app.run(debug=True)
