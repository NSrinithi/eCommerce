import { Link } from 'react-router';
import { useAuth } from '../../hooks/useAuth.js';
import { useAsyncData } from '../../hooks/useAsyncData.js';
import { systemApi } from '../../services/systemApi.js';
import { PageHeader } from '../../components/ui/PageHeader.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { Alert } from '../../components/ui/Alert.jsx';
export function DashboardPage() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useAsyncData(systemApi.ready);
  return <>
    <PageHeader title={`Hello, ${user.name.split(' ')[0]}.`} description="Your application starts here." />
    <div className="status-strip">
      <div className="status-copy">
        <span className={`status-dot ${error ? 'status-dot--error' : loading ? 'status-dot--waiting' : ''}`} />
        <strong>
          {loading ? 'Checking connection…' : error ? 'Connection needs attention' : 'API and database connected'}
        </strong>
        <span className="muted">
          {data?.status === 'ready' ? 'Ready for your next feature' : ''}
        </span>
      </div>
      <Button
        variant="ghost"
        onClick={reload}
        busy={loading}><Icon name="refresh" size={16} />Check</Button>
    </div>
    <Alert>
      {error}
    </Alert>
    <div className="overview-grid">
      <section className="panel starter-panel">
        <span className="panel-icon">
          <Icon name="layers" size={24} />
        </span>
        <h2>A foundation, not a finished app.</h2>
        <p className="muted">Navigation, authentication, themes and API connections are in place. Add the features your project needs.</p>
        <Link to="/examples" className="button button--primary">Explore the sample API <Icon name="arrow" size={18} /></Link>
        <div className="foundation-tags">
          <span>React</span>
          <span>Express</span>
          <span>MongoDB</span>
        </div>
      </section>
      <section className="panel">
        <h2>Your account</h2>
        <dl className="details-list">
          <div>
            <dt>Name</dt>
            <dd>
              {user.name}
            </dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>
              {user.email}
            </dd>
          </div>
          <div>
            <dt>Member since</dt>
            <dd>
              {new Date(user.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </dd>
          </div>
        </dl>
        <Link to="/profile" className="text-link">Manage profile <Icon name="arrow" size={16} /></Link>
      </section>
    </div>
    <section className="panel next-steps">
      <div className="section-heading">
        <h2>Make it yours</h2>
        <span className="muted">Three places to begin</span>
      </div>
      <Link to="/examples" className="next-step">
        <span className="step-number">01</span>
        <div>
          <strong>Try one complete API flow</strong>
          <p>Create, edit and delete a sample record.</p>
        </div>
        <Icon name="chevron" />
      </Link>
      <Link to="/settings" className="next-step">
        <span className="step-number">02</span>
        <div>
          <strong>Choose your workspace theme</strong>
          <p>Light, dark or your system preference.</p>
        </div>
        <Icon name="chevron" />
      </Link>
      <div className="next-step">
        <span className="step-number">03</span>
        <div>
          <strong>Add your first feature</strong>
          <p>Follow <code>docs/ADD-A-FEATURE.md</code> in the project folder.</p>
        </div>
        <Icon name="layers" />
      </div>
    </section>
  </>;
}
