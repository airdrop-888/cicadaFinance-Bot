const axios = require('axios');
const chalk = require('chalk');
const cfonts = require('cfonts');
const { HttpsProxyAgent } = require('http-proxy-agent');
const { SocksProxyAgent } = require('socks-proxy-agent');
const readlineSync = require('readline-sync');
const fs = require('fs').promises;

async function loadProxies() {
    try {
        const data = await fs.readFile('proxy.txt', 'utf8');
        return data.split('\n').filter(line => line.trim() !== '');
    } catch (error) {
        console.log(chalk.red(`❌ Error loading proxy.txt: ${error.message}`));
        return [];
    }
}

async function loadTokens() {
    try {
        const data = await fs.readFile('tokens.txt', 'utf8');
        return data.split('\n').filter(line => line.trim() !== '');
    } catch (error) {
        console.log(chalk.red(`❌ Error loading tokens.txt: ${error.message}`));
        return [];
    }
}

function getProxyAgent(proxy) {
    if (proxy.startsWith('http://')) {
        return new HttpsProxyAgent(proxy);
    } else if (proxy.startsWith('socks5://') || proxy.startsWith('socks4://')) {
        return new SocksProxyAgent(proxy);
    }
    return null;
}

async function makeRequest(url, method, headers, data, proxy) {
    const config = {
        method,
        url,
        headers,
        ...(data && { data }),
        ...(proxy && { httpsAgent: getProxyAgent(proxy) })
    };
    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        const errorMessage = error.response
            ? `HTTP ${error.response.status}: ${JSON.stringify(error.response.data)}`
            : error.message;
        throw new Error(`Request to ${url} failed: ${errorMessage}`);
    }
}

async function fetchTasks(token, proxy, campaignId) {
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
    };
    const tasksUrl = `https://campaign.cicada.finance/api/campaigns/${campaignId}/tasks`;
    console.log(chalk.yellow(`🔍 Fetching tasks for campaign ${campaignId}...`));
    try {
        const tasksData = await makeRequest(tasksUrl, 'GET', headers, null, proxy);
        console.log(chalk.cyan(`📋 Tasks fetched: ${JSON.stringify(tasksData)}`));
        return tasksData;
    } catch (error) {
        console.log(chalk.red(`❌ Error fetching tasks: ${error.message}`));
        return [];
    }
}

async function processTask(token, proxy, campaignId, taskId, taskName = 'Unnamed Task') {
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
    };

    try {
        // Add points
        const addPointsUrl = 'https://campaign.cicada.finance/api/points/add';
        const addPointsData = { taskId };
        console.log(chalk.yellow(`➕ Adding points for task ${taskId} (${taskName})...`));
        const addPointsResponse = await makeRequest(addPointsUrl, 'POST', headers, addPointsData, proxy);
        console.log(chalk.green(`✅ Points added: ${JSON.stringify(addPointsResponse)}`));

        // Credit gems
        const creditUrl = 'https://campaign.cicada.finance/api/gems/credit';
        const creditData = { transactionType: 'TASK', options: { taskId } };
        console.log(chalk.yellow(`💎 Crediting gems for task ${taskId} (${taskName})...`));
        const creditResponse = await makeRequest(creditUrl, 'POST', headers, creditData, proxy);
        console.log(chalk.magenta(`💎 Gems credited: ${JSON.stringify(creditResponse)}`));

    } catch (error) {
        console.log(chalk.red(`❌ Error processing task ${taskId} (${taskName}): ${error.message}`));
    }
}

async function main() {
    // Display banner
    cfonts.say('Airdrop 888', {
        font: 'block',
        align: 'center',
        colors: ['cyan', 'yellow'],
        background: 'transparent',
        letterSpacing: 1,
        lineHeight: 1,
        space: true,
        maxLength: '0'
    });
    console.log(chalk.bold.yellow('Script coded by - @balveerxyz || Auto Task Cicada Finance\n'));

    // Prompt for proxy usage
    const useProxy = readlineSync.question(chalk.blue('Mau menggunakan proxy? (y/n): ')).toLowerCase() === 'y';
    const proxies = useProxy ? await loadProxies() : [];
    const tokens = await loadTokens();

    if (tokens.length === 0) {
        console.log(chalk.red('❌ No tokens found in tokens.txt'));
        return;
    }

    const campaignId = 440; // Define campaignId explicitly

    for (let i = 0; i < tokens.length; i++) {
        console.log(chalk.bold.green(`\n🔄 Processing token ${i + 1}/${tokens.length}`));
        const proxy = proxies.length > 0 ? proxies[i % proxies.length] : null;
        if (proxy) {
            console.log(chalk.gray(`🌐 Using proxy: ${proxy}`));
        }

        const headers = {
            'Authorization': `Bearer ${tokens[i]}`,
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
        };

        // Fetch points to check completed tasks
        const pointsUrl = `https://campaign.cicada.finance/api/points?campaignId=${campaignId}`;
        console.log(chalk.yellow(`🔍 Fetching points for campaign ${campaignId}...`));
        let completedTasks = [];
        try {
            const pointsData = await makeRequest(pointsUrl, 'GET', headers, null, proxy);
            console.log(chalk.cyan(`🎯 Points fetched: ${JSON.stringify(pointsData)}`));
            completedTasks = pointsData.map(point => point.task_id);
        } catch (error) {
            console.log(chalk.red(`❌ Error fetching points: ${error.message}`));
            continue; // Skip to next token if points fetch fails
        }

        // Fetch available tasks
        const tasks = await fetchTasks(tokens[i], proxy, campaignId);
        if (tasks.length === 0) {
            console.log(chalk.yellow(`⚠️ No tasks available for campaign ${campaignId}`));
            continue;
        }

        // Filter uncompleted tasks
        const uncompletedTasks = tasks.filter(task => !completedTasks.includes(task.id));
        if (uncompletedTasks.length === 0) {
            console.log(chalk.yellow(`⚠️ All tasks already completed for this token`));
            continue;
        }

        // Process each uncompleted task
        for (const task of uncompletedTasks) {
            console.log(chalk.blue(`🚀 Processing task: ${task.id} (${task.name || 'Unnamed Task'})`));
            await processTask(tokens[i], proxy, campaignId, task.id, task.name);
            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    console.log(chalk.bold.cyan('\n🎉 All tasks completed!'));
}

main().catch(error => console.log(chalk.red(`❌ Main error: ${error.message}`)));