"""
FinEngine CFSBR Financial Math & Alternative Credit Risk Lab
Hugging Face Space interactive demo powered by finengine Python SDK.
"""

import gradio as gr
import pandas as pd
from finengine.math import calculate_amortization, calculate_xirr
from finengine.ai import MFSProfile, assess_credit_risk


def calculate_mfs_risk(inflows, outflows, avg_balance, tx_freq, utility_consistency, account_age):
    """Calculates thin-file alternative credit risk score and limits."""
    profile = MFSProfile(
        monthly_inflows=float(inflows),
        monthly_outflows=float(outflows),
        avg_balance=float(avg_balance),
        transaction_frequency=int(tx_freq),
        utility_bill_consistency=float(utility_consistency),
        account_age_months=int(account_age),
        past_defaults=0,
    )
    
    # Calculate recommended limit estimate
    net_flow = max(0.0, float(inflows) - float(outflows))
    req_amt = max(1000.0, net_flow * 1.1)
    
    assessment = assess_credit_risk(profile=profile, requested_amount=req_amt)
    
    score_display = f"{assessment.score} / 850 ({assessment.risk_tier} Tier)"
    pd_display = f"{assessment.default_probability * 100:.2f}%"
    limit_display = f"BDT {assessment.recommended_credit_limit:,.2f}"
    
    # Generate copyable Python code snippet
    code_snippet = f"""from finengine.ai import MFSProfile, assess_credit_risk

profile = MFSProfile(
    monthly_inflows={inflows:.1f},
    monthly_outflows={outflows:.1f},
    avg_balance={avg_balance:.1f},
    transaction_frequency={int(tx_freq)},
    utility_bill_consistency={utility_consistency:.2f},
    account_age_months={int(account_age)},
    past_defaults=0,
)

assessment = assess_credit_risk(profile=profile, requested_amount={assessment.recommended_credit_limit})
print(f"Credit Score:      {assessment.score} / 850")
print(f"Default Risk (PD): {assessment.default_probability * 100:.2f}%")
print(f"Recommended Limit: BDT {assessment.recommended_credit_limit:,.2f}")"""

    return score_display, pd_display, limit_display, code_snippet


def calculate_loan_schedule(principal, annual_rate, tenure_months):
    """Calculates deterministic reducing-balance loan amortization."""
    schedule = calculate_amortization(
        principal=float(principal),
        annual_rate=float(annual_rate) / 100.0,
        tenure_months=int(tenure_months),
    )
    
    df = pd.DataFrame(schedule)
    df["month"] = df["month"].astype(int)
    df["payment"] = df["payment"].apply(lambda x: f"BDT {x:,.2f}")
    df["principal"] = df["principal"].apply(lambda x: f"BDT {x:,.2f}")
    df["interest"] = df["interest"].apply(lambda x: f"BDT {x:,.2f}")
    df["balance"] = df["balance"].apply(lambda x: f"BDT {x:,.2f}")
    
    total_interest = sum(item["interest"] for item in schedule)
    summary_text = f"Monthly Installment: {df.iloc[0]['payment']} | Total Interest: BDT {total_interest:,.2f} | Total Repayable: BDT {float(principal) + total_interest:,.2f}"
    
    return summary_text, df.head(12)


# Build Gradio UI
with gr.Blocks(theme=gr.themes.Soft(primary_hue="blue", neutral_hue="slate"), title="FinEngine Quantitative Lab") as demo:
    gr.Markdown(
        """
        # ৳ FinEngine Financial Mathematics & AI Lab
        **Deterministic financial math primitives & thin-file credit risk scoring for Bangladesh & Emerging Markets.**
        
        * [GitHub Repository](https://github.com/gmrafi/FinEngine) · [Documentation](https://finengine.js.org) · [PyPI](https://pypi.org/project/finengine/)
        """
    )
    
    with gr.Tab("📱 MFS Alternative Credit Risk"):
        gr.Markdown("### Mobile Financial Service (bKash/Nagad) Thin-File Underwriting")
        with gr.Row():
            with gr.Column():
                inflows = gr.Slider(10000, 500000, value=75000, step=2500, label="Monthly Inflow (BDT)")
                outflows = gr.Slider(5000, 450000, value=35000, step=2500, label="Monthly Outflow (BDT)")
                balance = gr.Slider(1000, 100000, value=18000, step=1000, label="Daily Average Balance (BDT)")
                tx_freq = gr.Slider(5, 120, value=40, step=1, label="Transaction Frequency (tx/mo)")
                utility = gr.Slider(0.0, 1.0, value=1.0, step=0.05, label="Utility Bill Regularity (0.0 to 1.0)")
                age = gr.Slider(1, 60, value=24, step=1, label="Wallet History Age (Months)")
            
            with gr.Column():
                score_out = gr.Textbox(label="Estimated Credit Score (300 - 850)")
                pd_out = gr.Textbox(label="Probability of Default (PD %)")
                limit_out = gr.Textbox(label="Recommended Safe Credit Exposure")
                code_out = gr.Code(language="python", label="Generated finengine Python Code")
        
        calc_btn = gr.Button("Evaluate Risk & Generate Code", variant="primary")
        calc_btn.click(
            calculate_mfs_risk,
            inputs=[inflows, outflows, balance, tx_freq, utility, age],
            outputs=[score_out, pd_out, limit_out, code_out],
        )
    
    with gr.Tab("📊 Reducing-Balance Loan Amortization"):
        gr.Markdown("### Actuarial Reducing-Balance EMI & Day-Count Schedule")
        with gr.Row():
            with gr.Column():
                loan_principal = gr.Number(value=100000, label="Principal Amount (BDT)")
                loan_rate = gr.Number(value=9.0, label="Annual Interest Rate (%)")
                loan_tenure = gr.Slider(3, 60, value=12, step=1, label="Tenure (Months)")
                loan_btn = gr.Button("Calculate Amortization Schedule", variant="primary")
            
            with gr.Column():
                summary_out = gr.Textbox(label="Amortization Summary")
                table_out = gr.DataFrame(label="Repayment Schedule Preview (First 12 Months)")
        
        loan_btn.click(
            calculate_loan_schedule,
            inputs=[loan_principal, loan_rate, loan_tenure],
            outputs=[summary_out, table_out],
        )

if __name__ == "__main__":
    demo.launch()
